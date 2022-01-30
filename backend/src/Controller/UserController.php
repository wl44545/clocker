<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Repository\ClientRepository;
use App\Entity\User;

/**
 * @Route("/user", name="user_")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej usrekty</body></html>');
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
    public function getUser(Connection $connection, UserRepository $usrrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $usrrepo->find($id);
            return $this->json($user->toArray());
          }
          else {
            return $this->json(null);
          }
    }
    /**
     * @Route("/getusers/{token}", name="getusers", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getUsers(Connection $connection, UserRepository $userrepo, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $userrepo->findAll();
            return $this->json($user->toArray());
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/adduser/{name}/{password}/{role}/{token}", name="adduser", methods={"POST", "GET"})
     */
    public function addUser(Connection $connection, EntityManagerInterface $em, UserRepository $userrepo, ClientRepository $clientrepo, $name, $password, $role, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = new User();
            $user->setUsername($name);
            $user->setPassword($password);
            $user->setRole($role);
            $em->persist($user);
            $em->flush();

            return $this->json($user->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/updateuser/{id}/{name}/{password}/{role}/{token}", name="updateuser")
     */
    public function updateUser(Connection $connection,EntityManagerInterface $em, UserRepository $userrepo, ClientRepository $clientrepo, $id, $name, $password, $role, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $usrrepo->find($id);
            
			      $user->setUsername($name);
            $user->setPassword($password);
            $user->setRole($role);
            $em->persist($user);
            $em->flush();

            return $this->json($user->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/removeuser/{id}/{token}", name="removeuser")
     */
    public function removeUser(Connection $connection, EntityManagerInterface $em,  UserRepository $userrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $usrrepo->find($id);
            $em->remove($user);
            $em->flush();
          }
    }
}
