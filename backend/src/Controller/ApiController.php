<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
<<<<<<< Updated upstream
use App\Service\UsersService;
=======
>>>>>>> Stashed changes

class ApiController extends AbstractController
{
    public function __construct(UsersService $usersService) {
<<<<<<< Updated upstream
       $this->usersService = $usersService;
=======
       $this->UsersService = $usersService;
>>>>>>> Stashed changes
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
