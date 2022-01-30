import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel, UserModelRequest} from "../Models/user.model";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {}

  public getUsers(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.apiUrl}/users/getusers/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  public getUser(userID:number): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.apiUrl}/users/mygetuser/${userID}/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  public updateRole(user:UserModel): Observable<UserModel>{
    return this.httpClient.put<UserModel>(`${environment.apiUrl}/users/updateuser/${user.id}/${user.username}/${user.password}/${user.role}/${this.loginService.getToken()}`, user, this.loginService.getAuthorizedOptions());
  }

  public updateUser(user:UserModel): Observable<UserModel>{
    return this.httpClient.put<UserModel>(`${environment.apiUrl}/users/updateuser/${user.id}/${user.username}/${user.password}/${user.role}/${this.loginService.getToken()}`, user, this.loginService.getAuthorizedOptions());
  }

  public addUser(user:UserModelRequest): Observable<UserModel>{
    return this.httpClient.post<UserModel>(`${environment.apiUrl}/users/adduser/${user.username}/${user.password}/${user.role}/${this.loginService.getToken()}`, user, this.loginService.getAuthorizedOptions());
  }

  public removeUser(user:UserModel): Observable<UserModel>{
    return this.httpClient.delete<UserModel>(`${environment.apiUrl}/users/removeuser/${user.id}/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  public removeUserByID(userID:number): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.apiUrl}/users/removeuser/${userID}/${this.loginService.getToken()}`, this.loginService.getAuthorizedOptions());
  }

  }
