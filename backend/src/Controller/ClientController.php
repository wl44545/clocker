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


    /**
     * @Route("/getclient/{id}", name="getclient", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getClient(Connection $connection, $id): JsonResponse
    {
        $client = $connection->fetchAllAssociative('SELECT * FROM clients WHERE id='.$id.';');
        return $this->json($client);
    }
    /**
     * @Route("/getclient/{desc}", name="getclientbyname", methods={"POST", "GET"}, requirements={"id": "\d+"})
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
