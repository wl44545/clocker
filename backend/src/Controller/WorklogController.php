<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\WorklogRepository;
use App\Repository\ProjectRepository;
use App\Entity\Worklog;


use \DateTime;

/**
 * @Route("/worklog", name="worklog_")
 */
class WorklogController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej wpisy</body></html>');
    }

    public function check_access_token($string)
    {
      $data = explode('.', $string)[1];
      $data = base64_decode(str_replace(array('-', '_'), array('+', '/'), $data));
      $datajsonarray = json_decode($data, TRUE);
      $userrole = $datajsonarray['user_role'];
      $tokenexpiration = $datajsonarray['Expiration'];
      if($userrole == "USER" || $userrole == "USERADMIN" || $userrole == "ADMIN")
      {
        if(date($tokenexpiration) > date("Y-m-d H:i:s"))
        {
          return TRUE;
        }
        else
          return FALSE;
      }
      return FALSE;
    }

    /**
     * @Route("/user/{uid}/{token}", name="getuserworklog", methods={"POST", "GET"}, requirements={"uid": "\d+"})
     */
    public function getUserWorklog(Connection $connection, WorklogRepository $worklogrepo, $uid, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
           $worklog = $worklogrepo->find($uid);
           return $this->json($worklog->toArray());
        }
        else {
        return $this->json(null);
        }
    }
  
    /**
     * @Route("/addworklog/{desc}/{user}/{start}/{stop}/{proj}/{active}/{token}", name="addworklog", methods={"POST", "GET"})
     */
    public function addWorklog(Connection $connection, EntityManagerInterface $em, $desc = ' ',$user,$proj, $active = 0, $start, $stop, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $worklog = new Worklog();
            $worklog->setDescription($desc);
            $worklog->setStart($start);
            if($stop != 0 || $stop != NULL)
                $worklog->setStop($stop);
            $worklog->setActive($active);
            $worklog->setUser($user);
            $worklog->setProject($proj);
            $em->persist($worklog);
            $em->flush();

            return $this->json($worklog->toArray());
        }
        else {
        return $this->json(null);
        }

    }


    /**
     * @Route("/updateworklog/{id}/{desc}/{user}/{start}/{stop}/{proj}/{active}/{token}", name="updateworklog", requirements={"id": "\d+"})
     */
    public function updateWorklog(Connection $connection, EntityManagerInterface $em, WorklogRepository $worklogrepo, $id, $desc, $user, $start, $stop, $project, $active, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $worklog = $worklogrepo->find($id);
            $worklog->setDescription($desc);
            $worklog->setStart($start);
            $worklog->setStop($stop);
            $worklog->setActive($active);
            $worklog->setUser($user);
            $worklog->setProject($proj);
            $em->persist($worklog);
            $em->flush();

            return $this->json($user->toArray());
        }
        else {
        return $this->json(null);
        }
    }


    /**
     * @Route("/removeworklog/{id}/{token}", name="removeworklog", requirements={"id": "\d+"})
     */
    public function removeWorklog(Connection $connection, EntityManagerInterface $em, WorklogRepository $worklogrepo, $id, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $worklog = $usrrepo->find($id);
            $em->remove($user);
            $em->flush();
        }
    }
}