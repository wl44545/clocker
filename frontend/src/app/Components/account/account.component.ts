import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {SettingsService} from "../../Services/settings.service";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(public loginService: LoginService,
              public router: Router,
              private componentService: ComponentService) { }

  ngOnInit() {
    this.checkPermission();
    this.componentService.setComponent('AccountComponent');
  }

  private checkPermission(){
    if(!this.loginService.isLogged()){
      this.router.navigateByUrl('/').then();
    }
  }

  public changePassword(){
    window.alert('changePassword');
  }
  public deleteAccount(){
    window.alert('deleteAccount');
  }

}
