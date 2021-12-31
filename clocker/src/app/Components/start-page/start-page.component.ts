import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {StatsService} from "../../Services/stats.service";
import {StatsModel} from "../../Models/stats.model";
import {UserModel} from "../../Models/user.model";
import {Router} from "@angular/router";
import {APPROUTES} from "../../../assets/constans/AppRoutes";

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
              private router: Router) { }

  ngOnInit(): void {
    this.loadStats();
  }

  public login(){
    this.loginService.login(this.username, this.password).subscribe(user => {
      if(user == null){
        this.wrongLogin = true;
      }else{
        localStorage.setItem("USERNAME", user.username);
        localStorage.setItem("ROLE", user.role);
      }
    });
    //TODO: REMOVE BELOW
    if(this.username == "u" && this.password == "u"){
      this.router.navigateByUrl('/timer').then();
      localStorage.setItem("USERNAME", "USER");
      localStorage.setItem("ROLE", "USER");
      this.wrongLogin = false;
    }
    if(this.username == "ua" && this.password == "ua"){
      this.router.navigateByUrl('/timer').then();
      localStorage.setItem("USERNAME", "USERADMIN");
      localStorage.setItem("ROLE", "USERADMIN");
      this.wrongLogin = false;
    }
    else if(this.username == "a" && this.password == "a"){
      this.router.navigateByUrl('/admin').then();
      localStorage.setItem("USERNAME", "ADMIN");
      localStorage.setItem("ROLE", "ADMIN");
      this.wrongLogin = false;
    }
    else{
      this.wrongLogin = true;
    }
    //TODO: REMOVE ABOVE
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
    });
    //TODO: REMOVE BELOW
    let stats = new StatsModel(20,200,2000,20000);
    this.dayStats = stats.dayStats;
    this.weekStats = stats.weekStats;
    this.monthStats = stats.monthStats;
    this.yearStats = stats.yearStats;
    //TODO: REMOVE ABOVE
  }
}
