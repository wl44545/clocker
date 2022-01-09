<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ExampleService;
use App\Service\StatsService;

/**
 * @Route("/adminpanel", name="adminpanel_")
 */
class AdminPanelController extends AbstractController
{
    protected ExampleService $myService;

    protected StatsService $statsService;

    public function __construct(StatsService $statsService, ExampleService $myService) {
        $this->statsService = $statsService;
        $this->myService = $myService;
    }

    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return $this->render('adminPanel.html.twig', $this->myService->getPersonalData());
    }

    /**
     * @Route("/jsonresponse", name="jsonresponse")
     */
    public function getJson(): JsonResponse
    {
        return new JsonResponse($this->myService->getPersonalData());
        // return $this->json($this->myService->getPersonalData());
    }

    /**
     * @Route("/stats", name="stats")
     */
    public function getStats(): JsonResponse
    {
        // return new JsonResponse($this->statsService->getStats());
        return $this->json($this->statsService->getStats());
    }

}