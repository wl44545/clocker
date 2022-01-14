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
    return this.httpClient.get<UserModel[]>(`${environment.apiUrl}/login`, this.loginService.getAuthorizedOptions());
  }

  public updateRole(user:UserModel): Observable<UserModel>{
    console.log(user.role);
    return this.httpClient.put<UserModel>(`${environment.apiUrl}/login/${user.id}`, user, this.loginService.getAuthorizedOptions());
  }

  public addUser(user:UserModelRequest): Observable<UserModel>{
    return this.httpClient.post<UserModel>(`${environment.apiUrl}/login`, user, this.loginService.getAuthorizedOptions());
  }
}
