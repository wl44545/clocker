import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {StatsModel} from "../Models/stats.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {LoginService} from "./login.service";

import {SettingsModel} from "../Models/settings.model";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {
  }

  public getSettings(): Observable<SettingsModel> {
    return this.httpClient.get<SettingsModel>("../assets/mock_settings.json", this.loginService.getAuthorizedOptions());
    //return this.httpClient.get<SettingsModel>(`${environment.apiUrl}/settings`, this.loginService.getAuthorizedOptions());
  }

  public setSettings(settings: SettingsModel): Observable<SettingsModel> {
    return this.httpClient.post<SettingsModel>(`${environment.apiUrl}/settings`, settings, this.loginService.getAuthorizedOptions());
  }

}
