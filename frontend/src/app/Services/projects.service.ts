import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ProjectModel, ProjectModelRequest} from "../Models/project.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private httpClient: HttpClient) {
  }

  public getProjects(user: number): Observable<ProjectModel[]> {
    return this.httpClient.get<ProjectModel[]>(`${environment.apiUrl}/projects?user=${user}`);
  }

  public getProject(id: number): Observable<ProjectModel> {
    return this.httpClient.get<ProjectModel>(`${environment.apiUrl}/projects/${id}`);
  }

  public addProject(projectName: string, client: number, user: number): Observable<ProjectModel> {
    return this.httpClient.post<ProjectModel>(`${environment.apiUrl}/projects`, new ProjectModelRequest(projectName, user, client));
  }

  public editProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.put<ProjectModel>(`${environment.apiUrl}/projects/${project.id}`, project);
  }

  public removeProject(project: ProjectModel): Observable<ProjectModel>{
    return this.httpClient.delete<ProjectModel>(`${environment.apiUrl}/projects/${project.id}`);
  }
}
