import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {TimeEntryModel} from "../../Models/time-entry.model";
import {ProjectModel} from "../../Models/project.model";
import {ClientModel} from "../../Models/client.model";
import {TimerService} from "../../Services/timer.service";
import {ProjectsService} from "../../Services/projects.service";
import {ClientsService} from "../../Services/clients.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  worklog: TimeEntryModel[] = [];
  projects: ProjectModel[] = [];
  clients: ClientModel[] = [];
  totalTime: string = "";
  entryEdit: boolean = false;
  timerActive: boolean = false;

  manualEntry: TimeEntryModel = new TimeEntryModel(0,'','',new Date(),new Date(),0);
  manualDescription: string = "";
  manualProject: number = 0;
  manualStart: Date = new Date();
  manualStop: Date = new Date();

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

  private getWorklog(){
    this.timerService.getWorklog(this.loginService.getUsername()).subscribe(worklog => {
      this.worklog = [];
      for(let entry of worklog) {
        if(new Date(entry.stop) > new Date(Date.now() - 7*24*60*60*1000)){
          if (entry.project != 0) {
            this.projectsService.getProject(entry.project).subscribe(project => {
              entry.projectName = project.name;
              if (project.client != 0) {
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
          const minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          entry.timeDiff = `${hours}:${minutes}:${seconds}`;
          this.worklog.push(entry);
        }
      }
      this.getTotalTime();
    })
  }

  private getTotalTime(){
    let ms: number = 0;
    for (let entry of this.worklog) {
      ms += (new Date(entry.stop).getTime() - new Date(entry.start).getTime());
    }
    let seconds = ms / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes =  Math.floor(seconds / 60);
    seconds = seconds % 60;
    this.totalTime = `${hours}:${minutes}:${seconds}`;
  }

  public editEntry(entry: TimeEntryModel) {
    this.manualEntry = entry;
    this.manualDescription = entry.description;
    this.manualProject = entry.project;
    this.manualStart = entry.start;
    this.manualStop = entry.stop;
    this.entryEdit = true;
  }

  public removeEntry(entry: TimeEntryModel) {
    this.timerService.removeEntry(entry).subscribe(entry => {
      this.getWorklog();
      this.clearInput();
    });
  }

  public addEntry() {
    if(this.manualDescription != "" && new Date(this.manualStop) > new Date(this.manualStart)){
      this.timerService.addEntry(this.manualDescription, this.loginService.getUsername(), this.manualStart, this.manualStop, this.manualProject).subscribe(entry => {
        this.getWorklog();
        this.clearInput();
      })
    }
  }

  public saveEntry() {
    if(this.manualDescription != "" && new Date(this.manualStop) > new Date(this.manualStart)){
      this.manualEntry.description = this.manualDescription;
      this.manualEntry.project = this.manualProject;
      this.manualEntry.start = this.manualStart;
      this.manualEntry.stop = this.manualStop;
      this.manualEntry.projectName = "";
      this.manualEntry.clientName = "";
      this.manualEntry.timeDiff = "";
      this.timerService.editEntry(this.manualEntry).subscribe(entry => {
        this.getWorklog();
        this.clearInput();
      })
    }
  }

  private clearInput(){
    this.manualDescription = "";
    this.manualProject = 0;
    this.manualStart = new Date();
    this.manualStop = new Date();
    this.entryEdit = false;
  }

  public start() {
    this.timerActive = true;
  }

  public stop() {
    this.timerActive = false;
  }

}
