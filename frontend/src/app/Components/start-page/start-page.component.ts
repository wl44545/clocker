import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {StatsService} from "../../Services/stats.service";
import {StatsModel} from "../../Models/stats.model";
import {UserModel} from "../../Models/user.model";
import {Router} from "@angular/router";
import {APPROUTES} from "../../../assets/constants/AppRoutes";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  username: string = "";
  password: string = "";
  wrongLogin: boolean = false;

  dayStats: number = 0;
  weekStats: number = 0;
  monthStats: number = 0;
  yearStats: number = 0;

  constructor(public loginService: LoginService,
              private statsService: StatsService,
              private router: Router,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  public login(){
    this.wrongLogin = !this.loginService.login(this.username, this.password);
    this.clearLoginForm();
  }

  private clearLoginForm(){
    this.username = "";
    this.password = "";
  }

  private loadStats(){
    this.statsService.getStats().subscribe(stats => {
      this.dayStats = stats.dayStats;
      this.weekStats = stats.weekStats;
      this.monthStats = stats.monthStats;
      this.yearStats = stats.yearStats;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }
}
