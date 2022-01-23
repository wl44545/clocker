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
    return this.httpClient.get<ProjectModel[]>(`${environment.apiUrl}/project/getprojectsbyuser/${user}`, this.loginService.getAuthorizedOptions());
  }

  public getProject(id: number): Observable<ProjectModel> {
    return this.httpClient.get<ProjectModel>(`${environment.apiUrl}/project/getproject/${id}`, this.loginService.getAuthorizedOptions());
  }

  public addProject(projectName: string, client: number, user: number): Observable<ProjectModel> {
    return this.httpClient.post<ProjectModel>(`${environment.apiUrl}/project/addproject/${projectName}/${user}/${client}`, new ProjectModelRequest(projectName, user, client), this.loginService.getAuthorizedOptions());
  }

  public editProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.put<ProjectModel>(`${environment.apiUrl}/project/updateproject/${project.id}/${project.name}/${project.user}/${project.client}`, project, this.loginService.getAuthorizedOptions());
  }

  public removeProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.delete<ProjectModel>(`${environment.apiUrl}/project/removeproject/${project.id}`, this.loginService.getAuthorizedOptions());
  }
}
