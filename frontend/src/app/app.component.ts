import {Component, OnInit} from '@angular/core';
import {APPROUTES} from "../assets/constants/AppRoutes";
import {TranslateService} from "@ngx-translate/core";
import {LoginService} from "./Services/login.service";
import {LanguageService} from "./Services/language.service";
import {ComponentService} from "./Services/component.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'clocker';
  appRoutes = APPROUTES;

  timerHandler: number = 0;
  localTimeInSec: number = 0;
  timeControl: boolean = false;

  select: boolean = false;

  constructor(public loginService: LoginService,
              public translateService: TranslateService,
              private languageService: LanguageService,
              private componentService:ComponentService) {}

  ngOnInit(): void {
    this.translateService.addLangs(['EN','PL','DE']);
    this.translateService.setDefaultLang('EN');
    this.languageService.getCurrentLanguage();
  }

  hideMenu(){
    this.select = false;
  }

  switchLang(language: string) {
    this.languageService.setCurrentLanguage(language);
    this.hideMenu();
  }

  getComponent(component: string){
    return (component === this.componentService.getComponent());
  }

  logout(){
    this.hideMenu();
    this.clearLocal();
    this.loginService.logout();
  }

  timer(){
    this.timerHandler = setInterval(() => {
      this.localTimeInSec += 1;
    },1000)
  }

  getHour(){
    let wynik = Math.floor(this.localTimeInSec / 3600).toString();
    if(wynik.length == 1){
      if(wynik == '0'){
        return "    ";
      }
      wynik = '0' + wynik;
    }
    wynik = wynik + ':';
    return wynik;
  }

  getMinute(){
    let sec = this.localTimeInSec % 3600;
    let wynik = Math.floor(sec / 60).toString();
    if(wynik.length == 1){
      wynik = '0' + wynik;
    }
    wynik = wynik + ':';
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

  start(time: number){
    if(this.timeControl){
      return;
    }

    this.timeControl = true;
    this.localTimeInSec = time;

    this.timerHandler = setInterval(() => {
      this.localTimeInSec += 1;
    },1000)
  }

  clearLocal(){
    this.timeControl = false;
    clearInterval(this.timerHandler);
    this.localTimeInSec = 0;
  }

  stop(){
    this.clearLocal();
  }
}
