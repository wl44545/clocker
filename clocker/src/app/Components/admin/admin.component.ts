import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {UserModel} from "../../Models/user.model";

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

  newEmail: string = "";
  newPassword: string = "";
  newRole: string = "";


  constructor(private loginService: LoginService,
              private router: Router) { }

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

  getSize(){
    return this.width;
  }

}
