<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Service\UsersService;

class ApiController extends AbstractController
{
    public function __construct(UsersService $usersService) {
       $this->usersService = $usersService;
    }

    /**
     * @Route("/api", methods={"GET"})
     */
    public function handleGetApi()
    {
        $data = ['user' => $this->usersService->mygetUser()];

        return $this->json($data, 200);
    }
}
?>
