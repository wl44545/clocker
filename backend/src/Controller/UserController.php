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
     * @Route("/getuserbyname/{name}/{token}", name="getuserbyname", methods={"POST", "GET"})
     */
    public function getUserByName(Connection $connection, $name, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $sql = "SELECT * FROM users WHERE username = :name";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("name", $name);
            $resultSet = $stmt->executeQuery();
            return $this->json($resultSet->fetch());
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
            $sql = "INSERT INTO users (username, password, role) VALUES (:name, :pass, :role)";
            $stmt = $connection->prepare($sql);
            $stmt->bindValue("name", $username);
            $stmt->bindValue("pass", $pass);
            $stmt->bindValue("role", $role);
            $resultSet = $stmt->executeQuery();

            $ret = $this->getUserByName($connection, $username);
            return $this->json(json_decode($ret->getContent()));
        }
        else {
        return $this->json(null);
        }

    }


    /**
     * @Route("/updateuser/{id}/{username}/{pass}/{role}/{token}", name="updateuser")
     */
    public function updateUser(Connection $connection, $id, $username, $pass, $role, $token): JsonResponse
    {
        if($this->check_access_token($token))
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
            if($user == null)
                return $this->json(['result' => TRUE]);
            return $this->json(['result' => FALSE]);
        }
        else {
        return $this->json(null);
        }

    }
}
