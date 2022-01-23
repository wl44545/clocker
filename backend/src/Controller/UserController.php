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
     * @Route("/getuser/{id}/{token}", name="getuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function mygetUser(Connection $connection, $id, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        $user = $connection->fetchAllAssociative('SELECT * FROM users WHERE id ='.$id.';');
        return $this->json($user);
      }
      else {
        return $this->json(null);
      }

    }


    /**
     * @Route("/getusers/{token}", name="getusers", methods={"POST", "GET"})
     */
    public function getUsers(Connection $connection, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        $users = $connection->fetchAllAssociative('SELECT * FROM users;');
        return $this->json($users);
        //return $this->json($this->userService->getUsers());
      }
      else {
        return $this->json(null);
      }

    }

    /**
     * @Route("/adduser/{username}/{pass}/{role}/{token}", name="adduser", methods={"POST", "GET"})
     */
    public function addUser(Connection $connection, $username, $pass, $role, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        $user = $connection->fetchAllAssociative('INSERT INTO users (username, password, role) VALUES ('.$username.','.$pass.','.$role.');');
        return $this->json();
      }
      else {
        return $this->json(null);
      }

    }


    /**
     * @Route("/updaterole/{id}/{username}/{pass}/{role}/{token}", name="updaterole")
     */
    public function updateRole(Connection $connection, $id, $role, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        return $this->json('');
      }
      else {
        return $this->json(null);
      }

    }


    /**
     * @Route("/removeuser/{id}/{token}", name="removeuser")
     */
    public function removeUser(Connection $connection, $id, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        $user = $connection->fetchAllAssociative('DELETE FROM users WHERE id='.$id.';');
        if($user != null)
            return $this->json(['result' => TRUE]);
        return $this->json(['result' => FALSE]);
      }
      else {
        return $this->json(null);
      }

    }
}
