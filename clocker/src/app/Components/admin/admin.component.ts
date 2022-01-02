import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {UserModel, UserModelRequest} from "../../Models/user.model";
import {UserService} from "../../Services/user.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  time: number = 0;
  width: number = 0;
  firstshow: boolean = true;
  show: boolean = true;
  users: UserModel[] = [];
  role: string[] = ['Admin', 'User', 'UserAdmin'];
  error: boolean = false;
  komunikat: string = "";

  newEmail: string = "";
  newPassword: string = "";
  newRole: string = "";


  constructor(private loginService: LoginService,
              private router: Router, private userService: UserService) {
    this.getUsers();
  }

  ngOnInit(): void {
    this.checkPermission();
    this.control();
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
      },
      (error => {
        console.log(error);
      })
    );
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

    if(this.users.filter((item)=>{item.username == this.newEmail})){
      this.komunikat = "Użytkownik o takiej nazwie już istnieje, edytuj jego role.";
      this.error = true;
      this.newPassword = "";
      this.newEmail = "";
      return;
    }

    let user: UserModelRequest = new UserModelRequest(this.newEmail, this.newRole, this.newPassword);
    this.userService.addUser(user).subscribe((response) => {
      this.getUsers();
      console.log(response);
     });
    this.newPassword = "";
    this.newEmail = "";
  }

  exitError() {
    this.error = false;
  }
}
