<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;

/**
 * @Route("/project", name="project_")
 */
class ProjectController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej projekty</body></html>');
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
     * @Route("/getproject/{id}/{token}", name="getproject", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProject(Connection $connection, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE id='.$id.';');
        return $this->json($project);
          }
          else {
            return $this->json(null);
          }
    }
    /**
     * @Route("/getprojectsbyuser/{user}/{token}", name="getprojectsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProjectsByUser(Connection $connection, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE user="'.$user.'";');
        return $this->json($project);
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/getprojectbynameuser/{name}/{user}/{token}", name="getprojectbynameuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProjectByNameUser(Connection $connection, $name, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE name="'.$name.'"; AND user='.$user.'');
        return $this->json($project);
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/getprojects/{token}", name="getprojects", methods={"POST", "GET"})
     */
    public function getProjects(Connection $connection, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $projects = $connection->fetchAllAssociative('SELECT * FROM projects');
        return $this->json($projects);
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/addproject/{name}/{user}/{client}/{token}", name="addproject", methods={"POST", "GET"})
     */
    public function addProject(Connection $connection, $name, $user, $client, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $projects = $connection->fetchAllAssociative('INSERT INTO projects (name, user, client) VALUES ("'.$name.'",'.$user.', '.$client.');');
        $ret = $this->getProjectByNameUser($connection, $name, $user);
        return $this->json($ret);
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/updateproject/{id}/{name}/{user}/{client}/{token}", name="updateproject")
     */
    public function updateProject(Connection $connection, $id, $name, $user, $client, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $projects = $connection->fetchAllAssociative('UPDATE projects SET name = "'.$name.'", user = '.$user.', client = '.$client.' WHERE id ='.$id.';');
        return $this->json(['Updated project' => $id]);
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/removeproject/{id}/{token}", name="removeproject")
     */
    public function removeProject(Connection $connection, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
        $posts = $connection->fetchAllAssociative('DELETE FROM projects WHERE id='.$id.';');
        return $this->json(['success']);
          }
          else {
            return $this->json(null);
          }

    }
}
