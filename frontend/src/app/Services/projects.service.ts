import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ProjectModel, ProjectModelRequest} from "../Models/project.model";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {
  }

  public getProjects(user: number): Observable<ProjectModel[]> {
    return this.httpClient.get<ProjectModel[]>(`${environment.apiUrl}/projects?user=${user}`, this.loginService.getAuthorizedOptions());
  }

  public getProject(id: number): Observable<ProjectModel> {
    return this.httpClient.get<ProjectModel>(`${environment.apiUrl}/projects/${id}`, this.loginService.getAuthorizedOptions());
  }

  public addProject(projectName: string, client: number, user: number): Observable<ProjectModel> {
    return this.httpClient.post<ProjectModel>(`${environment.apiUrl}/projects`, new ProjectModelRequest(projectName, user, client), this.loginService.getAuthorizedOptions());
  }

  public editProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.put<ProjectModel>(`${environment.apiUrl}/projects/${project.id}`, project, this.loginService.getAuthorizedOptions());
  }

  public removeProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.delete<ProjectModel>(`${environment.apiUrl}/projects/${project.id}`, this.loginService.getAuthorizedOptions());
  }
}
