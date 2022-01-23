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

    function base64url_decode($data)
    {
      return base64_decode(str_replace(array('-', '_'), array('+', '/'), $data));
    }

    public function decodetoken($string)
    {
      $data = explode('.', $string);
      $data = $data[1];
      $data = $this->base64url_decode($data);
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
      if($this->decodetoken($token))
        {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE id='.$id.';');
        return $this->json($client);
      }
      else {
        return $this->json(null);
      }
    }
    /**
     * @Route("/getclientbyname/{name}", name="getclientbyname", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClientByName(Connection $connection, $name): JsonResponse
    {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE name="'.$name.'";');
        return $this->json($client);
    }

    /**
     * @Route("/getclients", name="getclients", methods={"POST", "GET"})
     */
    public function getClients(Connection $connection): JsonResponse
    {
        $clients = $connection->fetchAllAssociative('SELECT * FROM clients');
        return $this->json($clients);
    }

    /**
     * @Route("/getclientsbyuser/{user}", name="getclientsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClientsByUser(Connection $connection, $user): JsonResponse
    {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE user="'.$user.'";');
        return $this->json($client);
    }

    /**
     * @Route("/addclient/{name}/{user}", name="addclient", methods={"POST", "GET"})
     */
    public function addClient(Connection $connection, $name,$user): JsonResponse
    {
        $clients = $connection->fetchAllAssociative('INSERT INTO clients (name, user) VALUES ("'.$name.'",'.$user.');');
        $ret = $this->getClientByName($connection, $name);
        return $this->json($ret);
    }


    /**
     * @Route("/updateclient/{id}/{name}/{user}", name="updateclient")
     */
    public function updateClient(Connection $connection, $id, $name, $user): JsonResponse
    {
        $clients = $connection->fetchAllAssociative('UPDATE clients SET name = "'.$name.'", user = '.$user.' WHERE id ='.$id.';');
        return $this->json(['Updated client' => $id]);
    }


    /**
     * @Route("/removeclient/{id}", name="removeclient")
     */
    public function removeClient(Connection $connection, $id): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('DELETE FROM clients WHERE id='.$id.';');
        return $this->json(['success']);;
    }
}
