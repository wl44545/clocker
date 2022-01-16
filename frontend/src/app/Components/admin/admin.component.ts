import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public loginService: LoginService,
              public router: Router,
              private componentService: ComponentService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.componentService.setComponent('AdminComponent');
  }

  private checkPermission(){
    if(!this.loginService.isAdmin()){
      this.router.navigateByUrl('/').then();
    }
  }

}
