import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {ProjectModel} from "../../Models/project.model";
import {ProjectsService} from "../../Services/projects.service";
import {ClientModel} from "../../Models/client.model";
import {ClientsService} from "../../Services/clients.service";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projectName: string = "";
  projects: ProjectModel[] = [];
  project: ProjectModel = new ProjectModel(0,'',0,0);
  projectEdit: boolean = false;
  clientId: number = 0;
  clients: ClientModel[] = [];

  constructor(private loginService: LoginService,
              private router: Router,
              private projectsService: ProjectsService,
              private clientsService: ClientsService,
              private translateService:TranslateService,
              private componentService:ComponentService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getProjects();
    this.getClients();
    this.componentService.setComponent("ProjectsComponent");
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  public getClients(){
    this.clientsService.getClients(this.loginService.getUserID()).subscribe(clients => {
      this.clients = clients;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  public addProject(){
    if(this.projectName != "") {
      this.projectsService.addProject(this.projectName,this.clientId, this.loginService.getUserID()).subscribe(project => {
        this.getProjects();
        this.clearInput();
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }
  }

  public removeProject(project: ProjectModel){
    this.projectsService.removeProject(project).subscribe(project => {
      this.getProjects();
      this.clearInput();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  public getProjects(){
    this.projectsService.getProjects(this.loginService.getUserID()).subscribe(projects => {
      this.projects = projects;
      for(let project of this.projects){
        if(project.client!=0){
          this.clientsService.getClient(project.client).subscribe(client => {
            project.clientName = client.name;
          })
        }else{
          project.clientName = "";
        }
      }
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
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
      this.getProjects();
      this.clearInput();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  private clearInput() {
    this.projectName = "";
    this.clientId = 0;
    this.projectEdit = false;
  }
}
