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


    /**
     * @Route("/getpost/{id}", name="getpost", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getPost(Connection $connection, $id): JsonResponse
    {
        $sql = "SELECT * FROM worklog WHERE id = :id";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("id", $id);
        $resultSet = $stmt->executeQuery();
        return $this->json($resultSet->fetch());
        
    }
    /**
     * @Route("/user/{uid}", name="getuserpost", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getUserPost(Connection $connection, $uid): JsonResponse
    {
        $sql = "SELECT * FROM worklog WHERE user = :uid";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("uid", $uid);
        $resultSet = $stmt->executeQuery();
        return $this->json($resultSet->fetch());
    }
    /**
     * @Route("/getpost/{desc}", name="getpostbydesc", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getPostByDesc(Connection $connection, $desc): JsonResponse
    {
        $sql = "SELECT * FROM worklog WHERE description = :desc";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("desc", $desc);
        $resultSet = $stmt->executeQuery();
        return $this->json($resultSet->fetch());
    }

    /**
     * @Route("/getposts", name="getposts", methods={"POST", "GET"})
     */
    public function getPosts(Connection $connection): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('SELECT * FROM worklog');
        return $this->json($posts);
    }

    /**
     * @Route("/addpost/{desc}/{user}/{proj}/{active}", name="addpost", methods={"POST", "GET"})
     */
    public function addPost(Connection $connection, $desc,$user,$proj, $active = 0): JsonResponse
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


    /**
     * @Route("/updatepost/{id}/{desc}/{user}/{project}/{active}", name="updatepost", requirements={"id": "\d+"})
     */
    public function updatePost(Connection $connection, $id, $desc, $user, $project, $active): JsonResponse
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


    /**
     * @Route("/removepost/{id}", name="removepost", requirements={"id": "\d+"})
     */
    public function removePost(Connection $connection, $id): JsonResponse
    {
        $sql = "DELETE FROM worklog WHERE id = :id";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("id", $id);
        $resultSet = $stmt->executeQuery();
        return $this->json($resultSet);
    }
}