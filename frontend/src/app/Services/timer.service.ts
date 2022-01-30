import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TimeEntryModel, TimeEntryModelRequest, TimeLocalModelRequest} from "../Models/time-entry.model";
import {Time} from "@angular/common";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {
  }

  public getWorklog(user: number): Observable<TimeEntryModel[]> {
    return this.httpClient.get<TimeEntryModel[]>(`${environment.apiUrl}/worklog/user/${user}/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  public addEntry(description: string, user: number, start: Date, stop: Date, project: number, active: boolean): Observable<TimeEntryModel> {
    return this.httpClient.post<TimeEntryModel>(`${environment.apiUrl}/worklog/addworklog/${description}/${user}/${start}/${stop}/${project}/${active}/${this.loginService.getToken()}`,
      new TimeEntryModelRequest(description, user, start, stop, project, active), this.loginService.getAuthorizedOptions());
  }

  public editEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.put<TimeEntryModel>(`${environment.apiUrl}/worklog/updateworklog/${entry.id}/${entry.description}/${entry.user}/${entry.start}/${entry.stop}/${entry.project}/${entry.active}/${this.loginService.getToken()}`, entry, this.loginService.getAuthorizedOptions());
  }

  public removeEntry(entry: TimeEntryModel): Observable<TimeEntryModel>{
    return this.httpClient.delete<TimeEntryModel>(`${environment.apiUrl}/worklog/removeworklog/${entry.id}/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  public updateActive(id:number, timeModel: TimeLocalModelRequest): Observable<TimeEntryModel>{
    return this.httpClient.put<TimeEntryModel>(`${environment.apiUrl}/worklog/updateworklog/${id}/${timeModel.description}/${timeModel.user}/${timeModel.start}/${timeModel.stop}/${timeModel.project}/${timeModel.active}/${this.loginService.getToken()}`,timeModel, this.loginService.getAuthorizedOptions());
  }
}
