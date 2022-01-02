import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel, UserModelRequest} from "../Models/user.model";
import {LoginModel} from "../Models/login.model";
import {ClientModelRequest} from "../Models/client.model";
@Injectable({
  providedIn: 'root'
})
export class UserService{
  constructor(private httpClient: HttpClient) {}

  public getUsers(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.apiUrl}/login`);
  }

  public updateRole(user:UserModel): Observable<UserModel>{
    console.log(user.role);
    return this.httpClient.put<UserModel>(`${environment.apiUrl}/login/${user.id}`, user);
  }

  public addUser(user:UserModelRequest): Observable<UserModel>{
    return this.httpClient.post<UserModel>(`${environment.apiUrl}/login`, user);
  }
}
