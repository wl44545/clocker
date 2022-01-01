import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel} from "../Models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  constructor(private httpClient: HttpClient) {}

  public getUsers(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.apiUrl}/login`);
  }
}
