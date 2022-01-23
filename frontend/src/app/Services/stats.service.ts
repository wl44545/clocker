import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {StatsModel} from "../Models/stats.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {
  }

  public getStats(): Observable<StatsModel> {
    return this.httpClient.get<StatsModel>(`${environment.apiUrl}/adminpanel/stats`);
  }

}
