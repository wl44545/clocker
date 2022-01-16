import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UserModel} from "../Models/user.model";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {LoginRequestModel, LoginResponseModel} from "../Models/login.model";
import {Router} from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private token: string = "";

  constructor(private httpClient: HttpClient,
              private router: Router,
              private jwtService: JwtHelperService) {
  }

  public login(username: string, password: string): boolean {
   /* this.httpClient.post<LoginResponseModel>(`${environment.apiUrl}/login`, new LoginRequestModel(username, password)).subscribe(response => {
      if(response.token != null && this.isJWTValid(response.token) && this.isJWTPayloadOk(response.token)){
          localStorage.setItem("TOKEN", response.token);
          if(this.isUser()){
            this.router.navigateByUrl("/timer").then();
          }
          else if(this.isAdmin()){
            this.router.navigateByUrl("/admin").then();
          }
          else{
            this.router.navigateByUrl("/").then();
          }
          return true;
        }
    });
    return false;*/
    if(username != "" && this.isJWTValid(username) && this.isJWTPayloadOk(username)){
      localStorage.setItem("TOKEN", username);
      if(this.isUser()){
        this.router.navigateByUrl("/timer").then();
      }
      else if(this.isAdmin()){
        this.router.navigateByUrl("/admin").then();
      }
      else{
        this.router.navigateByUrl("/").then();
      }
      return true;
    }
    return false;
  }

  public logout() {
    /*this.httpClient.post(`${environment.apiUrl}/logout`, null, this.getAuthorizedOptions()).subscribe(() => {
      localStorage.removeItem("TOKEN");
      this.router.navigateByUrl("/").then();
    });*/
    localStorage.removeItem("TOKEN");
    this.router.navigateByUrl("/").then();
  }

  public getUserID(): number {
    if(this.decodeJWT() != null){
      return this.decodeJWT()['user_id'];
    }else{
      return 0;
    }
  }

  public getUsername(): string {
    if(this.decodeJWT() != null){
      return this.decodeJWT()['user_name'];
    }else{
      return "GUEST";
    }
  }

  public getRole(): string {
    if(this.decodeJWT() != null){
      return this.decodeJWT()['user_role'];
    }else{
      return "GUEST";
    }
  }

  public isLogged(): boolean{
    return localStorage.getItem("TOKEN") != null;
  }

  public isUser(): boolean{
    return this.getRole() == "USER" || this.getRole() == "USERADMIN";
  }

  public isAdmin(): boolean{
    return this.getRole() == "ADMIN" || this.getRole() == "USERADMIN";
  }


  private isJWTPayloadOk(token: string): boolean {
    const userIdExists = this.jwtService.decodeToken(token)['user_id'] != null;
    const userNameExists = this.jwtService.decodeToken(token)['user_name'] != null;
    const userRoleExists = this.jwtService.decodeToken(token)['user_role'] != null;
    return userIdExists && userNameExists && userRoleExists;
  }

  private isJWTValid(token: string): boolean {
    const isExpired = this.jwtService.isTokenExpired(token);
    return !isExpired;
  }

  private loadToken() {
    this.token = localStorage.getItem("TOKEN") || "";
    return this.token;
  }

  private decodeJWT() {
    this.loadToken();
    return this.jwtService.decodeToken(this.token);
  }

  public getAuthorizedOptions(){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loadToken()}`
      })
    };
  }

}
