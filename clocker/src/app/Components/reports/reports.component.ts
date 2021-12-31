import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {TimeEntryModel} from "../../Models/time-entry.model";
import {TimerService} from "../../Services/timer.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  worklog: TimeEntryModel[] = [];

  constructor(private loginService: LoginService,
              private router: Router,
              private timerService: TimerService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getWorklog();
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
        entry.timeDiff = "22:11:01";
      }
    })
  }

  getReport() {

  }
}
