<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Service\UsersService;
use PDO;

use Doctrine\DBAL\Connection;

class ApiController extends AbstractController
{

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
