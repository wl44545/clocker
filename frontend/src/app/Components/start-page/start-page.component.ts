import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {StatsService} from "../../Services/stats.service";
import {StatsModel} from "../../Models/stats.model";
import {UserModel} from "../../Models/user.model";
import {Router} from "@angular/router";
import {APPROUTES} from "../../../assets/constants/AppRoutes";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

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
              private translateService: TranslateService,
              private componentService: ComponentService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.loadStats();
    this.componentService.setComponent('StartPageComponent');
  }

  private checkPermission(){
    if(this.loginService.isLogged()){
      if(this.loginService.isUser()){
        this.router.navigateByUrl('/timer').then();
      }
      else if(this.loginService.isAdmin()){
        this.router.navigateByUrl('/admin').then();
      }
    }
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
