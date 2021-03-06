import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {SettingsService} from "../../Services/settings.service";
import {LanguageModel, SettingsModel} from "../../Models/settings.model";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: SettingsModel = new SettingsModel([], '', 0);

  constructor(public loginService: LoginService,
              public router: Router,
              private settingsService: SettingsService,
              private translateService: TranslateService,
              private componentService: ComponentService) { }

  ngOnInit() {
    this.checkPermission();
    this.loadSettings();
    this.componentService.setComponent('SettingsComponent');
  }

  private checkPermission(){
    if(!this.loginService.isAdmin()){
      this.router.navigateByUrl('/').then();
    }
  }

  private loadSettings(){
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  save() {
    if(this.settings.timerDays > 0 && this.settings.timerDays < 365){
      this.settingsService.setSettings(this.settings).subscribe(settings => {
        this.loadSettings();
        this.translateService.get('settingsSaved').subscribe(translation => {
          window.alert(translation);
        });
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }else{
      this.translateService.get('settingsSaveError').subscribe(translation => {
        window.alert(translation);
      });
    }
  }

}
