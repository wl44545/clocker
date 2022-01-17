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


    /**
     * @Route("/getproject/{id}", name="getproject", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProject(Connection $connection, $id): JsonResponse
    {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE id='.$id.';');
        return $this->json($project);
    }
    /**
     * @Route("/getprojectsbyuser/{user}", name="getprojectsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProjectsByUser(Connection $connection, $user): JsonResponse
    {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE user="'.$user.'";');
        return $this->json($project);
    }

    /**
     * @Route("/getprojectbynameuser/{name}/{user}", name="getprojectbynameuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProjectByNameUser(Connection $connection, $name, $user): JsonResponse
    {
        $project = $connection->fetchAllAssociative('SELECT * FROM projects WHERE name="'.$name.'"; AND user='.$user.'');
        return $this->json($project);
    }

    /**
     * @Route("/getprojects", name="getprojects", methods={"POST", "GET"})
     */
    public function getProjects(Connection $connection): JsonResponse
    {
        $projects = $connection->fetchAllAssociative('SELECT * FROM projects');
        return $this->json($projects);
    }

    /**
     * @Route("/addproject/{name}/{user}/{client}", name="addproject", methods={"POST", "GET"})
     */
    public function addProject(Connection $connection, $name, $user, $client): JsonResponse
    {
        $projects = $connection->fetchAllAssociative('INSERT INTO projects (name, user, client) VALUES ("'.$name.'",'.$user.', '.$client.');');
        $ret = $this->getProjectByNameUser($connection, $name, $user);
        return $this->json($ret);
    }


    /**
     * @Route("/updateproject/{id}/{name}/{user}/{client}", name="updateproject")
     */
    public function updateProject(Connection $connection, $id, $name, $user, $client): JsonResponse
    {
        $projects = $connection->fetchAllAssociative('UPDATE projects SET name = "'.$name.'", user = '.$user.', client = '.$client.' WHERE id ='.$id.';');
        return $this->json(['Updated project' => $id]);
    }


    /**
     * @Route("/removeproject/{id}", name="removeproject")
     */
    public function removeProject(Connection $connection, $id): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('DELETE FROM projects WHERE id='.$id.';');
        return $this->json(['success']);;
    }
}
