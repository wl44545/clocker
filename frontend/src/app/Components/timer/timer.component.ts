import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {TimeEntryModel, TimeLocalModelRequest} from "../../Models/time-entry.model";
import {ProjectModel} from "../../Models/project.model";
import {ClientModel} from "../../Models/client.model";
import {TimerService} from "../../Services/timer.service";
import {ProjectsService} from "../../Services/projects.service";
import {ClientsService} from "../../Services/clients.service";
import {formatDate} from '@angular/common';
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "../../Services/settings.service";
import {ComponentService} from "../../Services/component.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  // kontrola czasu na żywo

  update: boolean = false;
  timerHandler: number = 0;

  localTimeStart: string | null | undefined;
  localTimeTitle: string = "biezące zadanie";
  localClient: number = 0;
  localProject: number = 0;
  localTimeInSec: number = 0;
  localTimeModelId: number | undefined;

  private withoutMicrosec(value:string){
    let index = value.indexOf('.');
    if(index > 0){
      return value.slice(0,index);
    }
    return value;
  }

  public start() {
    console.log('start');
    this.timerActive = true;
    this.localTimeStart = this.withoutMicrosec(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en'));
    this.localTimeInSec = 0;
    this.timer();


    this.timerService.addEntry(this.localTimeTitle, this.loginService.getUserID(), new Date(), new Date(), 0, true).subscribe( response =>{
      this.localTimeModelId = response.id;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  clearLocal(){
    this.timerActive = false;
    clearInterval(this.timerHandler);
    this.localTimeTitle = "bieżące zadanie";
    this.localClient = 0;
    this.localProject = 0;
    this.localTimeInSec = 0;
  }

  save(active: boolean){
    if(this.localTimeModelId){
      let localTime = null;
      if (this.localTimeStart != null) {
        localTime = new TimeLocalModelRequest(
          this.localTimeTitle,
          this.loginService.getUserID(),
          this.localTimeStart,
          formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en'),
          this.localProject,
          active
        );
      }
      console.log(localTime);
      if(localTime != null){
        this.timerService.updateActive(this.localTimeModelId, localTime).subscribe(response=>{
          console.log(response);
        },() => {
          this.translateService.get('serverError').subscribe((text: string) => {
            window.alert(text);
          });
        });
      }
      return true;
    }
    else{
      this.clearLocal();
      return false;
    }
  }

  public stop() {
    console.log('stop');
    if(this.save(false)){
      this.getWorklog();
      this.clearLocal();
      this.appComponent.stop();
    }

  }

  saveChange() {
    this.update = false;
    this.save(true);

  }

  changeHandler(){
    this.update = true;
  }

  timer(){
    if (this.localTimeStart != null) {
      this.appComponent.start(this.localTimeInSec);
    }
    this.timerHandler = setInterval(() => {
      this.localTimeInSec += 1;
    },1000)
  }

  getHour(){
    let wynik = Math.floor(this.localTimeInSec / 3600).toString();
    if(wynik.length == 1){
      return '0' + wynik;
    }
    return wynik;
  }

  getMinute(){
    let sec = this.localTimeInSec % 3600;
    let wynik = Math.floor(sec / 60).toString();
    if(wynik.length == 1){
      return '0' + wynik;
    }
    return wynik;
  }

  getSecund(){
    let sec = this.localTimeInSec % 3600;
    let wynik = Math.floor(sec % 60).toString();
    if(wynik.length == 1){
      return '0' + wynik;
    }
    return wynik;
  }

  worklog: TimeEntryModel[] = [];
  projects: ProjectModel[] = [];
  clients: ClientModel[] = [];
  totalTime: string = "";
  entryEdit: boolean = false;
  timerActive: boolean = false;

  manualEntry: TimeEntryModel = new TimeEntryModel(0,'',0,new Date(),new Date(),0, false);
  manualDescription: string = "";
  manualProject: number = 0;
  manualStart: Date = new Date();
  manualStop: Date = new Date();

  constructor(private loginService: LoginService,
              private router: Router,
              private timerService: TimerService,
              private projectsService: ProjectsService,
              private clientsService: ClientsService,
              private translateService: TranslateService,
              private settingsService: SettingsService,
              private componentService: ComponentService,
              private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getWorklog();
    this.getProjects();
    this.getClients();
    this.componentService.setComponent('TimerComponent');
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  public getProjects(){
    this.projectsService.getProjects(this.loginService.getUserID()).subscribe(projects => {
      this.projects = projects;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
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

  private getWorklog(){
    this.settingsService.getSettings().subscribe(settings => {
      this.timerService.getWorklog(this.loginService.getUserID()).subscribe(worklog => {
        this.worklog = [];
        for(let entry of worklog) {
          if(entry.active){
            entry.stop = new Date();
          }
          if(new Date(entry.stop) > new Date(Date.now() - settings.timerDays*24*60*60*1000)){
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

            if(entry.active){
              this.localTimeTitle = entry.description;
              this.localTimeModelId = entry.id;
              this.localClient = entry.client;
              this.localProject = entry.project;
              this.timerActive = true;
              this.localTimeInSec = ms / 1000;
              this.localTimeStart = this.withoutMicrosec(entry.start.toString());
              this.timer();
            }
            else{
              this.worklog.push(entry);
            }
          }
        }
        this.getTotalTime();
        this.worklog.sort((a, b) => {
          if ( a.stop < b.stop ){
            return 1;
          }
          if ( a.stop > b.stop ){
            return -1;
          }
          return 0;
        });
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    });
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
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  public addEntry() {
    if(this.manualDescription != "" && new Date(this.manualStop) > new Date(this.manualStart)){
      this.timerService.addEntry(this.manualDescription, this.loginService.getUserID(), this.manualStart, this.manualStop, this.manualProject, false).subscribe(entry => {
        this.getWorklog();
        this.clearInput();
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
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
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }
  }

  private clearInput(){
    this.manualDescription = "";
    this.manualProject = 0;
    this.manualStart = new Date();
    this.manualStop = new Date();
    this.entryEdit = false;
  }
}
