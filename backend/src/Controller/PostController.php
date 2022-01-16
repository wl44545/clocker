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
    protected PostService $postService;


    public function __construct(PostService $postService) {
        $this->psotService = $postService;
    }

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
     * @Route("/getposts", name="getposts", methods={"POST", "GET"})
     */
    public function getPosts(Connection $connection): JsonResponse
    {
        $posts = $connection->fetchAllAssociative('SELECT * FROM worklog');
        return $this->json($posts);
    }

    /**
     * @Route("/addpost", name="addpost", methods={"POST", "GET"})
     */
    public function addPost(): JsonResponse
    {
        return $this->json(['added' => 'yes']);
    }


    /**
     * @Route("/updatepost/{id}", name="updatepost")
     */
    public function updatePost($id): JsonResponse
    {

        return $this->json(['updated' => 'yes']);
    }


    /**
     * @Route("/removepost/{id}", name="removepost")
     */
    public function removePost($id): JsonResponse
    {

        return $this->json(['removed' => 'yes']);
    }
}