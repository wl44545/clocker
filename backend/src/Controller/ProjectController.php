<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ProjectRepository;
use App\Repository\UserRepository;
use App\Repository\ClientRepository;
use App\Entity\Project;
use Doctrine\Common\Collections;

/**
 * @Route("/project", name="project_")
 */
class ProjectController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function main(): Response
    {
        return new Response('<html><body>hej projekty</body></html>');
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
     * @Route("/getproject/{id}/{token}", name="getproject", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProject(Connection $connection, ProjectRepository $projrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $project = $projrepo->find($id);
            return $this->json($project->toArray());
          }
          else {
            return $this->json(null);
          }
    }
    /**
     * @Route("/getprojectsbyuser/{user}/{token}", name="getprojectsbyuser", methods={"POST", "GET"}, requirements={"id": "\d+"})
     */
    public function getProjectsByUser(Connection $connection, UserRepository $userrepo, ProjectRepository $projrepo, $user, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $user = $userrepo->find($user);
            $projects = $user->getProjects();
            $ret = [];
           foreach($projects->getIterator() as $i => $project) {
                $tmp = 0;
                if($project->getClient()){
                    $tmp = $project->getClient()->getId();
                }
                $ret[] = [
                    'id' => $project->getId(),
                    'name' => $project->getName(),
                    'client' => $tmp,
                ];
            }

            return new JsonResponse($ret);
          }
          else {
            return $this->json(null);
          }

    }

    /**
     * @Route("/addproject/{name}/{user}/{client}/{token}", name="addproject", methods={"POST", "GET"})
     */
    public function addProject(Connection $connection, EntityManagerInterface $em, UserRepository $userrepo, ClientRepository $clientrepo, $name, $user, $client, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $project = new Project();
            $project->setName($name);
            $project->setUser($userrepo->find($user));
            if($client)
                $project->setClient($clientrepo->find($client));
            else
                $project->setClient(null);
            $em->persist($project);
            $em->flush();

            return $this->json($project->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/updateproject/{id}/{name}/{user}/{client}/{token}", name="updateproject")
     */
    public function updateProject(Connection $connection,EntityManagerInterface $em, ProjectRepository $projectrepo, ClientRepository $clientrepo, $id, $name, $user, $client, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $project = $projectrepo->find($id);
            $project->setName($name);
            if($client)
                $project->setClient($clientrepo->find($client));
            else
                $project->setClient(null);
            $em->persist($project);
            $em->flush();

            return $this->json($project->toArray());
          }
          else {
            return $this->json(null);
          }

    }


    /**
     * @Route("/removeproject/{id}/{token}", name="removeproject")
     */
    public function removeProject(Connection $connection, EntityManagerInterface $em,  ProjectRepository $projrepo, $id, $token): JsonResponse
    {
          if($this->check_access_token($token))
          {
            $project = $projrepo->find($id);
            $em->remove($project);
            $em->flush();
          }
          return new JsonResponse(null);
    }
}
