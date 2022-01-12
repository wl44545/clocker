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

  constructor(public loginService: LoginService,
              public translateService: TranslateService,
              private languageService: LanguageService,
              private componentService:ComponentService) {}

  ngOnInit(): void {
    this.translateService.addLangs(['EN','PL','DE']);
    this.translateService.setDefaultLang('EN');
    this.languageService.getCurrentLanguage();
  }

  switchLang(language: string) {
    this.languageService.setCurrentLanguage(language);
  }

  getTime(){
    return this.componentService.getTime();
  }

  getComponent(){
    let component:string = this.componentService.getComponent();

    if(component != 'TimerComponent' && component != 'AdminComponent' && component != 'StartPageComponent'){
      return true;
    }
    return false;
  }
}
