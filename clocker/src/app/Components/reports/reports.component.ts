import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {TimeEntryModel} from "../../Models/time-entry.model";
import {TimerService} from "../../Services/timer.service";
import {ProjectsService} from "../../Services/projects.service";
import {ClientsService} from "../../Services/clients.service";
import {ProjectModel} from "../../Models/project.model";
import {ClientModel} from "../../Models/client.model";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  worklog: TimeEntryModel[] = [];
  worklogQuery: TimeEntryModel[] = [];
  projects: ProjectModel[] = [];
  clients: ClientModel[] = [];
  queryProject: number = 0;
  queryClient: number = 0;

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ["description", "projectName", "clientName", "start", "stop", "timeDiff"],
    showTitle: false,
    title: 'report',
    useBom: false,
    removeNewLines: true,
    keys: ["description", "projectName", "clientName", "start", "stop", "timeDiff"],
    filename: "report"
  };

  constructor(private loginService: LoginService,
              private router: Router,
              private timerService: TimerService,
              private projectsService: ProjectsService,
              private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getWorklog();
    this.getProjects();
    this.getClients();
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  private getWorklog(){
    this.timerService.getWorklog(this.loginService.getUsername()).subscribe(worklog => {
      this.worklog = worklog;
      for(let entry of this.worklog){
        if(entry.project != null){
          this.projectsService.getProject(entry.project).subscribe(project => {
            entry.projectName = project.name;
            if(project.client != null){
              this.clientsService.getClient(project.client).subscribe(client => {
                entry.clientName = client.name;
                entry.client = client.id;
              })
            }
          })
        }
        let ms = (new Date(entry.stop).getTime() - new Date(entry.start).getTime());
        let seconds = ms / 1000;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minutes =  Math.floor(seconds / 60);
        seconds = seconds % 60;
        entry.timeDiff = `${hours}:${minutes}:${seconds}`;
      }
      this.worklogQuery = this.worklog;
    })
  }

  public doQuery() {
    if(this.queryClient == 0 && this.queryProject == 0){
      this.worklogQuery = this.worklog;
    }else{
      this.worklogQuery = [];
      for (let entry of this.worklog) {
        let query1: boolean = this.queryProject == entry.project || this.queryProject == 0;
        let query2: boolean = this.queryClient == entry.client || this.queryClient == 0;
        if (query1 && query2) {
          this.worklogQuery.push(entry);
        }
      }
    }
  }

  public getProjects(){
    this.projectsService.getProjects(this.loginService.getUsername()).subscribe(projects => {
      this.projects = projects;
    });
  }
  public getClients(){
    this.clientsService.getClients(this.loginService.getUsername()).subscribe(clients => {
      this.clients = clients;
    })
  }
}
