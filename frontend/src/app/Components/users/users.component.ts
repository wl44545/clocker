import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {UserModel, UserModelRequest} from "../../Models/user.model";
import {UserService} from "../../Services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";
import {ProjectModel} from "../../Models/project.model";
import {LoginSecurity} from "../../Models/login.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  time: number = 0;
  width: number = 0;
  firstshow: boolean = true;
  show: boolean = true;
  users: UserModel[] = [];
  role: string[] = ['ADMIN', 'USER', 'USERADMIN'];
  error: boolean = false;
  komunikat: string = "";
  isServerError: boolean = false;
  newEmail: string = "";
  newPassword: string = "";
  newRole: string = "";


  constructor(private loginService: LoginService,
              private router: Router,
              private userService: UserService,
              private translateService: TranslateService,
              private componentService: ComponentService) {
    this.getUsers();
  }

  ngOnInit(): void {
    this.checkPermission();
    this.control();
    this.componentService.setComponent('UsersComponent');
  }

  private checkPermission(){
    if(!this.loginService.isAdmin()){
      this.router.navigateByUrl('/').then();
    }
  }

  toMin() {
    this.show = false;
  }

  control(){
    this.time = setInterval(()=>{
      this.width = window.innerWidth;
      if(this.width <= 1020){
        if(this.firstshow){
          this.firstshow = false;
          this.show = false;
        }
      }
      else{
        this.show = true;
        this.firstshow = true;
      }
    },100);

  }

  toMax(){
    this.show = true;
  }

  getUsers(){
    this.userService.getUsers().subscribe((response) =>{
      this.users = response;
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
  }

  remove(user: UserModel, role: string){

    if(role == 'USER' && user.role == 'USERADMIN'){
      user.role = 'ADMIN';
    }
    else if(role == 'ADMIN'){
      user.role = 'USER';
    }

    this.userService.updateRole(user).subscribe((user)=>{
      this.userService.getUsers();
    })

  }

  add(user: UserModel, role: string){
    user.role = 'USERADMIN';

    this.userService.updateRole(user).subscribe((user)=> {
      this.userService.getUsers();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
  }

  addUser(){
    if(this.newEmail == "" || this.newPassword == ""){
      this.komunikat = "Hasło lub nazwa są niepoprawne. Wprowdź poprawne dane i spróbuj ponownie.";
      this.error = true;
      this.newPassword = "";
      this.newEmail = "";
      return;
    }
    if( this.users.filter(user => user.username == this.newEmail).length > 0 ){
      this.komunikat = "Użytkownik o takiej nazwie już istnieje, edytuj jego role.";
      this.error = true;
      this.newPassword = "";
      this.newEmail = "";
      return;
    }

    let user: UserModelRequest = new UserModelRequest(this.newEmail, this.newRole, LoginSecurity.getHash(this.newPassword));
    this.userService.addUser(user).subscribe((response) => {
      this.getUsers();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
    this.newPassword = "";
    this.newEmail = "";
  }

  exitError() {
    this.error = false;
  }

  public removeUser(user: UserModel){
    this.userService.removeUser(user).subscribe(user => {
      this.getUsers();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        if(!this.isServerError){
          this.isServerError = true;
          window.alert(text);
        }
      });
    });
  }

}
