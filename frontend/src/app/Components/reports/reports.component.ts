import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {TimeEntryModel} from "../../Models/time-entry.model";
import {TimerService} from "../../Services/timer.service";
import {ProjectsService} from "../../Services/projects.service";
import {ClientsService} from "../../Services/clients.service";
import {ProjectModel} from "../../Models/project.model";
import {ClientModel} from "../../Models/client.model";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  isServerError: boolean = false;
  worklog: TimeEntryModel[] = [];
  worklogQuery: TimeEntryModel[] = [];
  projects: ProjectModel[] = [];
  clients: ClientModel[] = [];
  queryProject: number = -1;
  queryClient: number = -1;

  dateNull: Date = new Date("0000-01-01T00:00:00");
  queryStartFrom: Date = this.dateNull;
  queryStartTo: Date = this.dateNull;
  queryStopFrom: Date = this.dateNull;
  queryStopTo: Date = this.dateNull;
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
              private clientsService: ClientsService,
              private translateService: TranslateService,
              private componentService: ComponentService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getWorklog();
    this.getProjects();
    this.getClients();
    this.componentService.setComponent('ReportsComponent');
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  private getWorklog(){
    this.timerService.getWorklog(this.loginService.getUserID()).subscribe(worklog => {
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
          },() => {
            this.translateService.get('serverError').subscribe((text: string) => {
              if(!this.isServerError){
                this.isServerError = true;
                window.alert(text);
              }
            });
          });
        }else{
          entry.project = 0;
          entry.projectName = "";
          entry.client = 0;
          entry.clientName = "";
        }
        let ms = (new Date(entry.stop).getTime() - new Date(entry.start).getTime());
        let seconds = ms / 1000;
        let hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        let minutes =  Math.floor(seconds / 60);
        seconds = seconds % 60;
        let h = hours.toString();
        let m = minutes.toString();
        let s = seconds.toString();
        if(hours < 10){
          h = '0' + h;
        }
        if(minutes < 10){
          m = '0' + m;
        }
        if(seconds < 10){
          s = '0' + s;
        }
        entry.timeDiff = `${h}:${m}:${s}`;
      }
      this.worklogQuery = this.worklog.sort((a, b) => {
        if ( a.stop < b.stop ){
          return 1;
        }
        if ( a.stop > b.stop ){
          return -1;
        }
        return 0;
      });
	  this.getTotalTime();
    })
  }

  private getTotalTime(){
    let ms: number = 0;
      for (let entry of this.worklogQuery) {
      ms += (new Date(entry.stop).getTime() - new Date(entry.start).getTime());
        }
    let seconds = ms / 1000;
    let hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    let minutes =  Math.floor(seconds / 60);
    seconds = seconds % 60;
    let h = hours.toString();
    let m = minutes.toString();
    let s = seconds.toString();
    if(hours < 10){
      h = '0' + h;
    }
    if(minutes < 10){
      m = '0' + m;
    }
    if(seconds < 10){
      s = '0' + s;
    }
    this.totalTime = `${h}:${m}:${s}`;
  }

  public doQuery() {
    if(this.queryClient == -1 && this.queryProject == -1 && !this.queryStartFrom && !this.queryStartTo && !this.queryStopFrom && !this.queryStopTo){
      this.worklogQuery = this.worklog;
    }else{
      this.worklogQuery = [];
      for (let entry of this.worklog) {
        let query1: boolean = true;
        if(this.queryProject != -1){
          query1 = this.queryProject == entry.project;
        }
        let query2: boolean = true;
        if(this.queryClient != -1){
          query2 = this.queryClient == entry.client;
        }
        let query3: boolean = true;
        if(this.queryStartFrom && this.queryStartFrom != this.dateNull){
          query3 = new Date(entry.start) >= new Date(this.queryStartFrom);
        }
        let query4: boolean = true;
        if(this.queryStartTo && this.queryStartTo != this.dateNull){
          query4 = new Date(entry.start) <= new Date(this.queryStartTo);
        }
        let query5: boolean = true;
        if(this.queryStopFrom && this.queryStopFrom != this.dateNull){
          query5 = new Date(entry.stop) >= new Date(this.queryStopFrom);
        }
        let query6: boolean = true;
        if(this.queryStopTo && this.queryStopTo != this.dateNull){
          query6 = new Date(entry.stop) <= new Date(this.queryStopTo);
        }

        if (query1 && query2 && query3 && query4 && query5 && query6) {
          this.worklogQuery.push(entry);
        }
      }
    }
    this.getTotalTime();
  }

  public getProjects(){
    this.projectsService.getProjects(this.loginService.getUserID()).subscribe(projects => {
      this.projects = projects;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
  }
  public getClients(){
    this.clientsService.getClients(this.loginService.getUserID()).subscribe(clients => {
      this.clients = clients;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
  }
}
