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
use App\Repository\UserRepository;


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
    public function getUserWorklog(Connection $connection, UserRepository $userrepo, $uid, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $user = $userrepo->find($uid);
            $worklogs = $user->getWorklogs();
            $ret = [];
           foreach($worklogs->getIterator() as $i => $worklog) {
                $tmp = 0;
                if($worklog->getProject())
                    $tmp = $worklog->getProject()->getId();
                $ret[] = [
                    'id' => $worklog->getId(),
                    'description' => $worklog->getDescription(),
                    'start' => $worklog->getStart()->format('Y-m-d\TH:i:s'),
                    'stop' => $worklog->getStop()->format('Y-m-d\TH:i:s'),
                    'user' => $worklog->getUser()->getId(),
                    'project' => $tmp,
                    'active' => $worklog->getActive(),
                ];
            }
            return new JsonResponse($ret);
        }
        else {
        return $this->json(null);
        }
    }
  
    /**
     * @Route("/addworklog/{desc}/{user}/{start}/{stop}/{proj}/{active}/{token}", name="addworklog", methods={"POST", "GET"})
     */
    public function addWorklog(Connection $connection, EntityManagerInterface $em, UserRepository $userrepo, ProjectRepository $projectrepo, $desc,$user,$proj, $active = 0, $start, $stop, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $worklog = new Worklog();
            $worklog->setDescription($desc);
            $worklog->setStart(new DateTime($start));
            if($stop != 0 || $stop != NULL)
                $worklog->setStop(new DateTime($stop));
            $worklog->setActive($active=='true');
            $worklog->setUser($userrepo->find($user));
            $worklog->setProject($projectrepo->find($proj));
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
    public function updateWorklog(Connection $connection, EntityManagerInterface $em, UserRepository $userrepo, ProjectRepository $projectrepo, WorklogRepository $worklogrepo, $id, $desc, $user, $start, $stop, $proj, $active, $token): JsonResponse
    {
        if($this->check_access_token($token))
        {
            $worklog = $worklogrepo->find($id);
            $worklog->setDescription($desc);
            $worklog->setStart(new DateTime($start));
            $worklog->setStop(new DateTime($stop));
            $worklog->setActive($active=='true');
            $worklog->setUser($userrepo->find($user));
            $worklog->setProject($projectrepo->find($proj));
            $em->persist($worklog);
            $em->flush();

            return $this->json($worklog->toArray());
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
            $worklog = $worklogrepo->find($id);
            $em->remove($worklog);
            $em->flush();
        }
        return new JsonResponse(null);
    }
}