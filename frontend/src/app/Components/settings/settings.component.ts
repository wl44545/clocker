import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {SettingsService} from "../../Services/settings.service";
import {LanguageModel, SettingsModel} from "../../Models/settings.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // languages: LanguageModel[] = [];
  // language: string = "";
  settings: SettingsModel = new SettingsModel([], '', 0);

  constructor(public loginService: LoginService,
              public router: Router,
              private settingsService: SettingsService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.checkPermission();
    this.loadSettings();
  }

  private checkPermission(){
    if(!this.loginService.isAdmin()){
      this.router.navigateByUrl('/').then();
    }
  }

  private loadSettings(){
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
      // this.languages = settings.languages;
      // this.language = settings.language;
    });
  }

  save() {
    if(this.settings.timerDays > 0 && this.settings.timerDays < 365){
      this.settingsService.setSettings(this.settings).subscribe(settings => {
        this.loadSettings();
        this.translateService.get('settingsSaved').subscribe(translation => {
          window.alert(translation);
        });
      });
    }else{
      this.translateService.get('settingsSaveError').subscribe(translation => {
        window.alert(translation);
      });
    }
  }

}
