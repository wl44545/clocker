import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public loginService: LoginService,
              public router: Router) { }

  ngOnInit(): void {
    this.checkPermission();
  }

  private checkPermission(){
    if(!this.loginService.isAdmin()){
      this.router.navigateByUrl('/').then();
    }
  }

}
