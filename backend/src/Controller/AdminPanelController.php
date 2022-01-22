<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ExampleService;
use PDO;
use Doctrine\DBAL\Connection;
use \Datetime;

/**
 * @Route("/adminpanel", name="adminpanel_")
 */
class AdminPanelController extends AbstractController
{
    protected ExampleService $myService;


    public function __construct(ExampleService $myService) {
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
    public function getStats(Connection $connection): JsonResponse
    {
        $stats = $connection->fetchAllAssociative('SELECT start, stop FROM worklog;');

        $today = new DateTime('NOW');
        $todayDay = $today->format('j');
        $todayMonth = $today->format('n');
        $todayYear = $today->format('Y');

        $dayStats = 0;
        $weekStats = 0;
        $monthStats = 0;
        $yearStats = 0;



        foreach($stats as $stat)
        {
            $hour = (int)substr($stat['stop'], 11) - (int)substr($stat['start'], 11);
            $minute = (int)substr($stat['stop'], 14) - (int)substr($stat['start'], 14);
            $second = (int)substr($stat['stop'], 17) - (int)substr($stat['start'], 17);


            if((string)(int)substr($stat['stop'], 8) == $todayDay && (string)(int)substr($stat['stop'], 5) == $todayMonth)
            {
                $dayStats += $second;
                $dayStats += $minute * 60;
                $dayStats += $hour * 3600;
            }
            elseif (($todayDay - (string)(int)substr($stat['stop'], 8)) <= 7)
            {
                $weekStats += $second;
                $weekStats += $minute * 60;
                $weekStats += $hour * 3600;
            }
            
            if ((string)(int)substr($stat['stop'], 5) == $todayMonth)
            {
                $monthStats += $second;
                $monthStats += $minute * 60;
                $monthStats += $hour * 3600;
            } 

            if ((string)(int)substr($stat['stop'], 0) == $todayYear)
            {
                $yearStats += $second;
                $yearStats += $minute * 60;
                $yearStats += $hour * 3600;
            } 

            
            
        }
        return $this->json(
            [
                "dayStats" => $dayStats,
                "weekStats" => $weekStats,
                "monthStats" => $monthStats,
                "yearStats" => $yearStats,
            ]
    );
    }

}