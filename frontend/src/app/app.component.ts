import {Component, OnInit} from '@angular/core';
import {APPROUTES} from "../assets/constants/AppRoutes";
import {TranslateService} from "@ngx-translate/core";
import {LoginService} from "./Services/login.service";
import {LanguageService} from "./Services/language.service";
import {SettingsModel} from "./Models/settings.model";
import {SettingsService} from "./Services/settings.service";
import {ComponentService} from "./Services/component.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'clocker';
  appRoutes = APPROUTES;
  isNavOpen: boolean = false;
  width = 0.05 * window.innerWidth;

  timerHandler: number = 0;
  localTimeInSec: number = 0;
  timeControl: boolean = false;

  constructor(public loginService: LoginService,
              public translateService: TranslateService,
              private languageService: LanguageService,
              private settingsService: SettingsService,
              private componentService: ComponentService,
              private router: Router) {}

  ngOnInit(): void {
    this.setLanguages();
    this.languageService.getCurrentLanguage();
 }

  public goToTimer(){
      this.router.navigateByUrl('/timer').then();
  }

  public switchLang(language: string) {
    this.isNavOpen = !this.isNavOpen;
    this.languageService.setCurrentLanguage(language);
 }

 private setLanguages(){
   let languages: string[] = [];
   this.settingsService.getSettings().subscribe(settings => {
     settings.languages.forEach(language => {
       languages.push(language.code);
     });
     this.translateService.addLangs(languages);
     this.translateService.setDefaultLang(settings.language);
   },() => {
     this.translateService.get('serverError').subscribe((text: string) => {
       window.alert(text);
     });
   });
 }

  getComponent(component: string){
    return (component === this.componentService.getComponent());
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

  logout() {
    this.clearLocal();
    this.loginService.logout()
  }
}
