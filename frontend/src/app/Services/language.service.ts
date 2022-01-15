import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {SettingsModel} from "../Models/settings.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor (private translateService: TranslateService,
               private httpClient: HttpClient) {}

  setCurrentLanguage(language: string){
    this.translateService.use(language);
    window.localStorage.setItem("LANG",language);
  }

  getCurrentLanguage(){
    this.translateService.use(<string>window.localStorage.getItem("LANG"));
  }

}
