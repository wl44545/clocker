<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;
use \Datetime;

/**
 * @Route("/adminpanel", name="adminpanel_")
 */
class AdminPanelController extends AbstractController
{

    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return $this->render('adminPanel.html.twig');
    }

    /**
     * @Route("/stats", name="stats")
     */
    public function getStats(Connection $connection): JsonResponse
    {
        $dayStats = $connection->fetchAllAssociative('SELECT SUM(TIME_TO_SEC(TIMEDIFF(stop,start))) from worklog  WHERE stop <= NOW() and stop >= NOW() - INTERVAL 1 DAY;');
        $weekStats = $connection->fetchAllAssociative('SELECT SUM(TIME_TO_SEC(TIMEDIFF(stop,start))) from worklog  WHERE stop <= NOW() and stop >= NOW() - INTERVAL 7 DAY;');
        $monthStats = $connection->fetchAllAssociative('SELECT SUM(TIME_TO_SEC(TIMEDIFF(stop,start))) from worklog  WHERE stop <= NOW() and stop >= NOW() - INTERVAL 1 MONTH;');
        $yearStats = $connection->fetchAllAssociative('SELECT SUM(TIME_TO_SEC(TIMEDIFF(stop,start))) from worklog  WHERE stop <= NOW() and stop >= NOW() - INTERVAL 1 YEAR;');

        return $this->json(
            [
                "dayStats" => array_values($dayStats[0])[0],
                "weekStats" => array_values($weekStats[0])[0],
                "monthStats" => array_values($monthStats[0])[0],
                "yearStats" => array_values($yearStats[0])[0],
            ]
    );
    }

}