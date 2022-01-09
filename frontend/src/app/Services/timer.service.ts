import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TimeEntryModel, TimeEntryModelRequest, TimeLocalModelRequest} from "../Models/time-entry.model";
import {Time} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private httpClient: HttpClient) {
  }

  public getWorklog(username: string): Observable<TimeEntryModel[]> {
    return this.httpClient.get<TimeEntryModel[]>(`${environment.apiUrl}/worklog?username=${username}`);
  }

  public addEntry(description: string, username: string, start: Date, stop: Date, project: number, active: boolean): Observable<TimeEntryModel> {
    return this.httpClient.post<TimeEntryModel>(`${environment.apiUrl}/worklog`,
      new TimeEntryModelRequest(description, username, start, stop, project, active));
  }

  public editEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.put<TimeEntryModel>(`${environment.apiUrl}/worklog/${entry.id}`, entry);
  }

  public removeEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.delete<TimeEntryModel>(`${environment.apiUrl}/worklog/${entry.id}`);
  }

  public updateActive(id:number, timeModel: TimeLocalModelRequest): Observable<TimeEntryModel>{
    return this.httpClient.put<TimeEntryModel>(`${environment.apiUrl}/worklog/${id}`,timeModel);
  }
}
