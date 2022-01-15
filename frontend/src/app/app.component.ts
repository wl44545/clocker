import {Component, OnInit} from '@angular/core';
import {APPROUTES} from "../assets/constants/AppRoutes";
import {TranslateService} from "@ngx-translate/core";
import {LoginService} from "./Services/login.service";
import {LanguageService} from "./Services/language.service";
import {SettingsModel} from "./Models/settings.model";
import {SettingsService} from "./Services/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'clocker';
  appRoutes = APPROUTES;
  isNavOpen: boolean = false;

  constructor(public loginService: LoginService,
              public translateService: TranslateService,
              private languageService: LanguageService,
              private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.setLanguages();
    this.languageService.getCurrentLanguage();
 }

  public switchLang(language: string) {
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
   });
 }

}
