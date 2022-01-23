<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;

use Doctrine\DBAL\Connection;

/**
 * @Route("/users", name="users_")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej</body></html>');
    }


    /**
     * @Route("/getuser/{id}", name="getuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function mygetUser(Connection $connection, $id): JsonResponse
    {
        $user = $connection->fetchAllAssociative('SELECT * FROM users WHERE id ='.$id.';');
        return $this->json($user);
    }


    /**
     * @Route("/getusers", name="getusers", methods={"POST", "GET"})
     */
    public function getUsers(Connection $connection): JsonResponse
    {
        $users = $connection->fetchAllAssociative('SELECT * FROM users;');
        return $this->json($users);
        //return $this->json($this->userService->getUsers());
    }

    /**
     * @Route("/adduser/{username}/{pass}/{role}", name="adduser", methods={"POST", "GET"})
     */
    public function addUser(Connection $connection, $username, $pass, $role): JsonResponse
    {
        $user = $connection->fetchAllAssociative('INSERT INTO users (username, password, role) VALUES ('.$username.','.$pass.','.$role.');');
        return $this->json();
    }


    /**
     * @Route("/updaterole/{id}/{username}/{pass}/{role}", name="updaterole")
     */
    public function updateRole(Connection $connection, $id, $role): JsonResponse
    {
        return $this->json('');
    }


    /**
     * @Route("/removeuser/{id}", name="removeuser")
     */
    public function removeUser(Connection $connection, $id): JsonResponse
    {
        $user = $connection->fetchAllAssociative('DELETE FROM users WHERE id='.$id.';');
        if($user != null)
            return $this->json(['result' => TRUE]);
        return $this->json(['result' => FALSE]);
    }
}
