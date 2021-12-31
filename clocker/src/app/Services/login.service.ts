import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UserModel} from "../Models/user.model";
import {StatsModel} from "../Models/stats.model";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {LoginModel} from "../Models/login.model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  public login(username: string, password: string): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.apiUrl}/login`, new LoginModel(username, password));
  }

  public logout() {
    localStorage.removeItem("ROLE");
    localStorage.removeItem("USERNAME");
    this.router.navigateByUrl("/").then();
  }

  public getRole(): string | null{
    return localStorage.getItem("ROLE");
  }

  public getUsername(): string | null{
    return localStorage.getItem("USERNAME");
  }

  public isLogged(): boolean{
    return this.getRole() != null && this.getUsername() != null;
  }

  public isUser(): boolean{
    return this.getRole() == "USER" || this.getRole() == "USERADMIN";
  }

  public isAdmin(): boolean{
    return this.getRole() == "ADMIN" || this.getRole() == "USERADMIN";
  }

}
