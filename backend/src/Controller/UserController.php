<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UsersService;



/**
 * @Route("/users", name="users_")
 */
class UserController extends AbstractController
{
    protected UsersService $userService;


    public function __construct(UsersService $userService) {
        $this->userService = $userService;
    }

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
    public function mygetUser($id): JsonResponse
    {

        return $this->json($this->userService->mygetUser($id));
    }

    /**
     * @Route("/getusers", name="getusers", methods={"POST", "GET"})
     */
    public function getUsers(): JsonResponse
    {

        return $this->json($this->userService->getUsers());
    }

    /**
     * @Route("/adduser", name="adduser", methods={"POST", "GET"})
     */
    public function addUser(): JsonResponse
    {
        return $this->json($this->userService->addUser());
    }


    /**
     * @Route("/updaterole/{id}/{role}", name="updaterole")
     */
    public function updateRole($id, $role): JsonResponse
    {

        return $this->json($this->userService->updateRole($id, $role));
    }


    /**
     * @Route("/removeuser/{id}", name="removeuser")
     */
    public function removeUser($id): JsonResponse
    {

        return $this->json($this->userService->removeUser($id));
    }
}