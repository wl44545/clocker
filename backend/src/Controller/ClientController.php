<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;


/**
 * @Route("/client", name="client_")
 */
class ClientController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej klienci</body></html>');
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
     * @Route("/getclient/{id}/{token}", name="getclient", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClient(Connection $connection, $id, $token): JsonResponse
    {
      if($this->check_access_token($token))
        {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE id='.$id.';');
        return $this->json($client);
      }
      else {
        return $this->json(null);
      }
    }
    /**
     * @Route("/getclientbyname/{name}/{token}", name="getclientbyname", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClientByName(Connection $connection, $name, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE name="'.$name.'";');
        return $this->json($client);
        }
        else {
        return $this->json(null);
        }
    }

    /**
     * @Route("/getclients/{token}", name="getclients", methods={"POST", "GET"})
     */
    public function getClients(Connection $connection, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $clients = $connection->fetchAllAssociative('SELECT * FROM clients');
        return $this->json($clients);
        }
        else {
        return $this->json(null);
        }
    }

    /**
     * @Route("/getclientsbyuser/{user}/{token}", name="getclientsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClientsByUser(Connection $connection, $user, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE user="'.$user.'";');
        return $this->json($client);
        }
        else {
        return $this->json(null);
        }
    }

    /**
     * @Route("/addclient/{name}/{user}/{token}", name="addclient", methods={"POST", "GET"})
     */
    public function addClient(Connection $connection, $name,$user, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $clients = $connection->fetchAllAssociative('INSERT INTO clients (name, user) VALUES ("'.$name.'",'.$user.');');
        $ret = $this->getClientByName($connection, $name, $token);
        return $this->json($ret);
        }
        else {
        return $this->json(null);
        }
    }


    /**
     * @Route("/updateclient/{id}/{name}/{user}/{token}", name="updateclient")
     */
    public function updateClient(Connection $connection, $id, $name, $user, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $clients = $connection->fetchAllAssociative('UPDATE clients SET name = "'.$name.'", user = '.$user.' WHERE id ='.$id.';');
        return $this->json(['Updated client' => $id]);
        }
        else {
        return $this->json(null);
        }
    }


    /**
     * @Route("/removeclient/{id}/{token}", name="removeclient")
     */
    public function removeClient(Connection $connection, $id, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
        $posts = $connection->fetchAllAssociative('DELETE FROM clients WHERE id='.$id.';');
        return $this->json(['success']);
        }
        else {
        return $this->json(null);
        }
    }
}
