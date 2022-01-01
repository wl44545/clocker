import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor (private translateService: TranslateService) {}

  setCurrentLanguage(language: string){
    this.translateService.use(language);
    window.localStorage.setItem("LANG",language);
  }

  getCurrentLanguage(){
    this.translateService.use(<string>window.localStorage.getItem("LANG"));
  }

}
