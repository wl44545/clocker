<?php

namespace App\Entity;

use App\Repository\WorklogRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WorklogRepository::class)]
class Worklog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $description;

    #[ORM\Column(type: 'datetime')]
    private $start;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private $stop;

    #[ORM\Column(type: 'integer')]
    private $user;

    #[ORM\Column(type: 'integer')]
    private $project;

    #[ORM\Column(type: 'boolean')]
    private $active;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getStop(): ?\DateTimeInterface
    {
        return $this->stop;
    }

    public function setStop(?\DateTimeInterface $stop): self
    {
        $this->stop = $stop;

        return $this;
    }

    public function getUser(): ?string
    {
        return $this->user;
    }

    public function setUser(?int $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getProject(): ?string
    {
        return $this->project;
    }

    public function setProject(?int $project): self
    {
        $this->project = $project;

        return $this;
    }

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function toArray(): array
    {
        $ret = [
            'id' => $this->getId(),
            'description' => $this->getDescription(),
            'start' => $this->getStart(),
            'stop' => $this->getStop(),
            'user' => $this->getUser()->toArray(),
            'project' => $this->getProject(),
            'active' => $this->getActive(),
        ];

        return $ret;
    }
}
