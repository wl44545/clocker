import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {StatsModel} from "../Models/stats.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ClientModel, ClientModelRequest} from "../Models/client.model";
import {ProjectModel} from "../Models/project.model";
import {TimeEntryModel} from "../Models/time-entry.model";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private httpClient: HttpClient) {
  }

  public getWorklog(username: string): Observable<TimeEntryModel[]> {
    return this.httpClient.get<TimeEntryModel[]>(`${environment.apiUrl}/worklog?username=${username}`);
  }

}
