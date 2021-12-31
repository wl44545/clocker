import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {ProjectModel} from "../../Models/project.model";
import {ProjectsService} from "../../Services/projects.service";
import {ClientModel} from "../../Models/client.model";
import {ClientsService} from "../../Services/clients.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projectName: string = "";
  projects: ProjectModel[] = [];
  project: ProjectModel = new ProjectModel(0,'','',null);
  projectEdit: boolean = false;
  clientId: number|null = null;
  clients: ClientModel[] = [];

  constructor(private loginService: LoginService,
              private router: Router,
              private projectsService: ProjectsService,
              private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getProjects();
    this.getClients();
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  public getClients(){
    this.clientsService.getClients(this.loginService.getUsername()).subscribe(clients => {
      this.clients = clients;
    })
  }

  public addProject(){
    if(this.projectName != "") {
      this.projectsService.addProject(this.projectName,this.clientId, this.loginService.getUsername()).subscribe(project => {
        this.projectName = "";
        this.clientId = null;
        this.getProjects();
      });
    }
  }

  public removeProject(project: ProjectModel){
    this.projectsService.removeProject(project).subscribe(project => {
      this.projectName = "";
      this.clientId = null;
      this.projectEdit = false;
      this.getProjects();
    });
  }

  public getProjects(){
    this.projectsService.getProjects(this.loginService.getUsername()).subscribe(projects => {
      this.projects = projects;
      for(let project of this.projects){
        if(project.client!=null){
          this.clientsService.getClient(project.client).subscribe(client => {
            project.clientName = client.name;
          })
        }else{
          project.clientName = "";
        }
      }
    })
  }

  public editProject(project: ProjectModel){
    this.project = project;
    this.projectName = project.name;
    this.clientId = project.client;
    this.projectEdit = true;
  }

  public saveProject() {
    this.project.name = this.projectName;
    this.project.clientName = "";
    this.project.client = this.clientId;
    this.projectsService.editProject(this.project).subscribe(project => {
      this.projectName = "";
      this.clientId = null;
      this.projectEdit = false;
      this.getProjects();
    });
  }
}
