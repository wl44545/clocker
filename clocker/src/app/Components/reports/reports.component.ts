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
  queryProject: number = -1;
  queryClient: number = -1;
  totalTime: string = "";

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
        if(entry.project != 0){
          this.projectsService.getProject(entry.project).subscribe(project => {
            entry.projectName = project.name;
            if(project.client != 0){
              this.clientsService.getClient(project.client).subscribe(client => {
                entry.clientName = client.name;
                entry.client = client.id;
              })
            }else{
              entry.client = 0;
              entry.clientName = "";
            }
          })
        }else{
          entry.project = 0;
          entry.projectName = "";
          entry.client = 0;
          entry.clientName = "";
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
	  this.getTotalTime();
    console.log(this.worklogQuery)
    })
  }

  private getTotalTime(){
    let ms: number = 0;
      for (let entry of this.worklogQuery) {
      ms += (new Date(entry.stop).getTime() - new Date(entry.start).getTime());
        }
    let seconds = ms / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes =  Math.floor(seconds / 60);
    seconds = seconds % 60;
    this.totalTime = `${hours}:${minutes}:${seconds}`;
  }

  public doQuery() {
    if(this.queryClient == -1 && this.queryProject == -1){
      this.worklogQuery = this.worklog;
    }else{
      this.worklogQuery = [];
      for (let entry of this.worklog) {
        let query1: boolean = this.queryProject == entry.project || this.queryProject == -1;
        let query2: boolean = this.queryClient == entry.client || this.queryClient == -1;
        if (query1 && query2) {
          this.worklogQuery.push(entry);
        }
      }
    }
	this.getTotalTime();
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
