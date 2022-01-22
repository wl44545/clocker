<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\PostService;
use PDO;
use Doctrine\DBAL\Connection;

/**
 * @Route("/post", name="post_")
 */
class PostController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej wpisy</body></html>');
    }


    /**
     * @Route("/getpost/{id}", name="getpost", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getPost(Connection $connection, $id): JsonResponse
    {
        $post = $connection->fetchAllAssociative('SELECT * FROM worklog WHERE id='.$id.';');
        return $this->json($post);
    }
    /**
     * @Route("/user/{uid}", name="getuserpost", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getUserPost(Connection $connection, $uid): JsonResponse
    {
        $post = $connection->fetchAllAssociative('SELECT * FROM worklog WHERE user='.$uid.';');
        return $this->json($post);
    }
    /**
     * @Route("/getpost/{desc}", name="getpostbydesc", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getPostByDesc(Connection $connection, $desc): JsonResponse
    {
        $post = $connection->fetchAllAssociative('SELECT * FROM worklog WHERE description="'.$desc.'";');
        return $this->json($post);
    }

    /**
     * @Route("/getposts", name="getposts", methods={"POST", "GET"})
     */
    public function getPosts(Connection $connection): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('SELECT * FROM worklog');
        return $this->json($posts);
    }

    /**
     * @Route("/addpost/{desc}/{user}/{proj}", name="addpost", methods={"POST", "GET"})
     */
    public function addPost(Connection $connection, $desc,$user,$proj): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('INSERT INTO worklog (description, start, stop, user, project, active) VALUES ("'.$desc.'","2022-01-15 16:20:00","2022-01-15 16:25:00",'.$user.','.$proj.',0);');
        $ret = $this->getPostByDesc($connection, $desc);
        return $this->json($ret);
    }


    /**
     * @Route("/updatepost/{id}/{desc}", name="updatepost", requirements={"id": "\d+"})
     */
    public function updatePost(Connection $connection, $id, $desc): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('UPDATE worklog SET description = "'.$desc.'" WHERE id ='.$id.';');
        return $this->json(['Updated post' => $id]);
    }


    /**
     * @Route("/removepost/{id}", name="removepost", requirements={"id": "\d+"})
     */
    public function removePost(Connection $connection, $id): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('DELETE FROM worklog WHERE id='.$id.';');
        return $this->json(['success']);;
    }
}