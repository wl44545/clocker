<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ORM\Table(name: "projects")]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'projects')]
    #[ORM\JoinColumn(nullable: false)]
    private $user;

    #[ORM\ManyToOne(targetEntity: Client::class, inversedBy: 'projects')]
    private $client;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Worklog::class)]
    private $worklogs;

    public function __construct()
    {
        $this->worklogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    public function toArray(): array
    {
        $tmp = 0;
        if($this->getClient())
            $tmp = $this->getClient()->getId();
        $ret = [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'user' => $this->getUser()->getId(),
            'client' => $tmp,
        ];

        return $ret;
    }

    /**
     * @return Collection|Worklog[]
     */
    public function getWorklogs(): Collection
    {
        return $this->worklogs;
    }

    public function addWorklog(Worklog $worklog): self
    {
        if (!$this->worklogs->contains($worklog)) {
            $this->worklogs[] = $worklog;
            $worklog->setProject($this);
        }

        return $this;
    }

    public function removeWorklog(Worklog $worklog): self
    {
        if ($this->worklogs->removeElement($worklog)) {
            // set the owning side to null (unless already changed)
            if ($worklog->getProject() === $this) {
                $worklog->setProject(null);
            }
        }

        return $this;
    }
}
