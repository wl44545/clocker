<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
<<<<<<< Updated upstream
use App\Service\UsersService;
<<<<<<< HEAD
use PDO;

use Doctrine\DBAL\Connection;

class ApiController extends AbstractController
{
=======
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
>>>>>>> 80e15011eb1015ece01d457be5eb2e5edac7e0dc

    /**
     * @Route("/api", methods={"GET"})
     */
    public function handleGetApi(Connection $connection)
    {
        $data = ['user' => $connection->fetchAllAssociative('SELECT * FROM users WHERE id ='.$id.';')];

        return $this->json($data, 200);
    }
}
?>
