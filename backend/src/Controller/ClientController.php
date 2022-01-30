<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ClientRepository;
use App\Repository\UserRepository;
use App\Entity\Client;

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
        return new Response('<html><body>hej clekty</body></html>');
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
    public function getClient(Connection $connection, ClientRepository $clrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $client = $clrepo->find($id);
            return $this->json($client->toArray());
          }
          else {
            return $this->json(null);
          }
    }
    /**
     * @Route("/getclientsbyuser/{user}/{token}", name="getclientsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClientsByUser(Connection $connection, UserRepository $userrepo, ClientRepository $clientrepo, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $userrepo->find($user);
            $clients = $user->getClients();
            $ret = [];
           foreach($clients->getIterator() as $i => $client) {
                $ret[] = [
                    'id' => $client->getId(),
                    'name' => $client->getName(),
                ];
            }
            return new JsonResponse($ret);
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/addclient/{name}/{user}/{token}", name="addclient", methods={"POST", "GET"})
     */
    public function addClient(Connection $connection, EntityManagerInterface $em, UserRepository $userrepo, ClientRepository $clientrepo, $name, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $client = new Client();
            $client->setName($name);
            $client->setUser($userrepo->find($user));
            $em->persist($client);
            $em->flush();

            return $this->json($client->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/updateclient/{id}/{name}/{user}/{token}", name="updateclient")
     */
    public function updateClient(Connection $connection, EntityManagerInterface $em, ClientRepository $clientrepo, $id, $name, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $client = $clientrepo->find($id);
            $client->setName($name);
            $em->persist($client);
            $em->flush();

            return $this->json($client->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/removeclient/{id}/{token}", name="removeclient")
     */
    public function removeClient(Connection $connection, EntityManagerInterface $em,  ClientRepository $clientrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $client = $clientrepo->find($id);
            $em->remove($client);
            $em->flush();
          }
          return new JsonResponse(null);
    }
}
