import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

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
