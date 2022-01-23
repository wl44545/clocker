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
     * @Route("/getuserbyname/{name}", name="getuserbyname", methods={"POST", "GET"})
     */
    public function getUserByName(Connection $connection, $name): JsonResponse
    {
        $sql = "SELECT * FROM users WHERE username = :name";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("name", $name);
        $resultSet = $stmt->executeQuery();
        return $this->json($resultSet->fetch());
    }

    /**
     * @Route("/getusers", name="getusers", methods={"POST", "GET"})
     */
    public function getUsers(Connection $connection): JsonResponse
    {
        $users = $connection->fetchAllAssociative('SELECT * FROM users;');
        return $this->json($users);
    }

    /**
     * @Route("/adduser/{username}/{pass}/{role}", name="adduser", methods={"POST", "GET"})
     */
    public function addUser(Connection $connection, $username, $pass, $role): JsonResponse
    {

        $sql = "INSERT INTO users (username, password, role) VALUES (:name, :pass, :role)";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("name", $username);
        $stmt->bindValue("pass", $pass);
        $stmt->bindValue("role", $role);
        $resultSet = $stmt->executeQuery();

        $ret = $this->getUserByName($connection, $username);
        return $this->json(json_decode($ret->getContent()));
    }


    /**
     * @Route("/updateuser/{id}/{username}/{pass}/{role}", name="updateuser")
     */
    public function updateUser(Connection $connection, $id, $username, $pass, $role): JsonResponse
    {
        $sql = "UPDATE users SET username = :name, password = :pass, role = :role WHERE id = :id";
        $stmt = $connection->prepare($sql);
        $stmt->bindValue("name", $username);
        $stmt->bindValue("pass", $pass);
        $stmt->bindValue("role", $role);
        $stmt->bindValue("id", $id);
        $resultSet = $stmt->executeQuery();
        $ret = $this->getUserByName($connection, $username);
        return $this->json(json_decode($ret->getContent()));
    }


    /**
     * @Route("/removeuser/{id}", name="removeuser")
     */
    public function removeUser(Connection $connection, $id): JsonResponse
    {
        $user = $connection->fetchAllAssociative('DELETE FROM users WHERE id='.$id.';');
        if($user == null)
            return $this->json(['result' => TRUE]);
        return $this->json(['result' => FALSE]);
    }
}
