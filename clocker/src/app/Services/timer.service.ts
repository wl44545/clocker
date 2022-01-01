import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TimeEntryModel, TimeEntryModelRequest} from "../Models/time-entry.model";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private httpClient: HttpClient) {
  }

  public getWorklog(username: string): Observable<TimeEntryModel[]> {
    return this.httpClient.get<TimeEntryModel[]>(`${environment.apiUrl}/worklog?username=${username}`);
  }

  public addEntry(description: string, username: string, start: Date, stop: Date, project: number): Observable<TimeEntryModel> {
    return this.httpClient.post<TimeEntryModel>(`${environment.apiUrl}/worklog`,
      new TimeEntryModelRequest(description, username, start, stop, project));
  }

  public editEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.put<TimeEntryModel>(`${environment.apiUrl}/worklog/${entry.id}`, entry);
  }

  public removeEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.delete<TimeEntryModel>(`${environment.apiUrl}/worklog/${entry.id}`);
  }
}
