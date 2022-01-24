<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\PostService;
use PDO;
use Doctrine\DBAL\Connection;

use \DateTime;

/**
 * @Route("/post", name="post_")
 */
class PostController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej wpisy</body></html>');
    }

    public function check_access_token($string)
    {
      $data = explode('.', $string)[1];
      $data = base64_decode(str_replace(array('-', '_'), array('+', '/'), $data));
      $datajsonarray = json_decode($data, TRUE);
      $userrole = $datajsonarray['user_role'];
      $tokenexpiration = $datajsonarray['Expiration'];
      if($userrole == "USER" || $userrole == "USERADMIN" || $userrole == "ADMIN")
      {
        if(date($tokenexpiration) > date("Y-m-d H:i:s"))
        {
          return TRUE;
        }
        else
          return FALSE;
      }
      return FALSE;
    }


    /**
     * @Route("/getpost/{id}/{token}", name="getpost", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getPost(Connection $connection, $id, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "SELECT * FROM worklog WHERE id = :id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("id", $id);
            $resultSet = $stmt->executeQuery();
            return $this->json($resultSet->fetch());
        }
        else {
        return $this->json(null);
        }
    }
    /**
     * @Route("/user/{uid}/{token}", name="getuserpost", methods={"POST", "GET"}, requirements={"uid": "\d+"})
     */
    public function getUserPost(Connection $connection, $uid, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "SELECT * FROM worklog WHERE user = :uid";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("uid", $uid);
            $resultSet = $stmt->executeQuery();
            return $this->json($resultSet->fetch());
        }
        else {
        return $this->json(null);
        }
    }
    /**
     * @Route("/getpost/{desc}/{token}", name="getpostbydesc", methods={"POST", "GET"})
     */
    public function getPostByDesc(Connection $connection, $desc, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "SELECT * FROM worklog WHERE description = :desc";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("desc", $desc);
            $resultSet = $stmt->executeQuery();
            return $this->json($resultSet->fetch());
        }
        else {
        return $this->json(null);
        }
    }

    /**
     * @Route("/getposts/{token}", name="getposts", methods={"POST", "GET"})
     */
    public function getPosts(Connection $connection, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $posts = $connection->fetchAllAssociative('SELECT * FROM worklog');
            return $this->json($posts);
        }
        else {
        return $this->json(null);
        }
    }

    /**
     * @Route("/addpost/{desc}/{user}/{proj}/{active}/{token}", name="addpost", methods={"POST", "GET"})
     */
    public function addPost(Connection $connection, $desc,$user,$proj, $active = 0, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "INSERT INTO worklog (description, start, stop, user, project, active) VALUES (:desc,:start,:stop,:user, :proj, :active)";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("desc", $desc);
            $stmt->bindValue("user", $user);
            $stmt->bindValue("proj", $proj);
            $stmt->bindValue("active", $active);
            $stmt->bindValue("start", (new DateTime('NOW'))->format('Y-m-d G:i:s'));
            $stmt->bindValue("stop", (new DateTime('NOW'))->format('Y-m-d G:i:s'));

            $resultSet = $stmt->executeQuery();


            $ret = $this->getPostByDesc($connection, $desc);
            return $this->json(json_decode($ret->getContent()));
        }
        else {
        return $this->json(null);
        }

    }


    /**
     * @Route("/updatepost/{id}/{desc}/{user}/{project}/{active}/{token}", name="updatepost", requirements={"id": "\d+"})
     */
    public function updatePost(Connection $connection, $id, $desc, $user, $project, $active, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "UPDATE worklog SET description = :description, user = :user, project = :project, active = :active WHERE id = :id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("description", $desc);
            $stmt->bindValue("user", $user);
            $stmt->bindValue("project", $project);
            $stmt->bindValue("active", $active);
            $stmt->bindValue("id", $id);


            $resultSet = $stmt->executeQuery();
            $ret = $this->getPost($connection, $id);
            return $this->json(json_decode($ret->getContent()));
        }
        else {
        return $this->json(null);
        }
    }


    /**
     * @Route("/removepost/{id}/{token}", name="removepost", requirements={"id": "\d+"})
     */
    public function removePost(Connection $connection, $id, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "DELETE FROM worklog WHERE id = :id";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("id", $id);
            $resultSet = $stmt->executeQuery();
            return $this->json($resultSet);
        }
        else {
        return $this->json(null);
        }
    }
}