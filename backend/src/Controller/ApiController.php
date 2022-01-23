<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Service\UsersService;

use PDO;

use Doctrine\DBAL\Connection;

/**
 * @Route("/api", name="api_")
 */
class ApiController extends AbstractController
{

    /**
     * @Route("/getapi", methods={"GET"})
     */
    public function handleGetApi(Connection $connection)
    {
        $data = ['user' => $connection->fetchAllAssociative('SELECT * FROM users WHERE id ='.$id.';')];
        return $this->json($data, 200);
    }

    public function base64_encode_url($string)
    {
      return str_replace(['+','/','='], ['-','_',''], base64_encode($string));
    }
    /**
     * @Route("/login_check/{username}/{passwordhash}", methods={"GET"})
     */
    public function login(Connection $connection, $username, $passwordhash)
    {
        $user = $connection->fetchAllAssociative('SELECT * FROM users WHERE username ="'.$username.'";');
        if($user[0]['password'] == $passwordhash)
        {
          $header = '{"alg": "HS256", "typ": "JWT"}';
          $payload = '{"Issuer": "Clocker", "Issued At": "'.date("Y-m-d H:i:s").'", "Expiration": "'.date("Y-m-d H:i:s", strtotime("+2 hours")).'", "user_name": "'.$user[0]['username'].'", "user_role": "'.$user[0]['role'].'", "user_id": "'.$user[0]['id'].'"}';
          $key = "GCG95kMjrEKeC11z8GuUQD4mGmixiSYUAKLHZ_e6dZk";
          $tmp = $this->base64_encode_url($header) . '.' . $this->base64_encode_url($payload);
          $signature = hash_hmac('sha256', $tmp, $key);
          $obj['token'] = $this->base64_encode_url($header) . '.' . $this->base64_encode_url($payload) . '.' . $signature;
          return $this->json($obj['token'], 200);
        }
        else
        {
          return $this->json(null, 200);
        }
    }
}
?>
