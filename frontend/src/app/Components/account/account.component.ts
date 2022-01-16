import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {SettingsService} from "../../Services/settings.service";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";
import {UserService} from "../../Services/user.service";
import {UserModel} from "../../Models/user.model";
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  isChangePassword: boolean = false;
  isDeleteAccount: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;

  constructor(public loginService: LoginService,
              public router: Router,
              private componentService: ComponentService,
              private translateService: TranslateService,
              private userService: UserService) { }

  ngOnInit() {
    this.checkPermission();
    this.componentService.setComponent('AccountComponent');
  }

  private checkPermission(){
    if(!this.loginService.isLogged()){
      this.router.navigateByUrl('/').then();
    }
  }

  private getHash(input: string): string{
    const md5 = new Md5();
    return md5.appendStr(input).end().toString();
  }

  public changePassword(){
    if(this.newPassword == this.oldPassword){
      this.translateService.get('wrongNewPassword').subscribe((text: string) => {
        window.alert(text);
      });
    }else{
      this.userService.getUser(this.loginService.getUserID()).subscribe(user => {
        if(this.getHash(this.oldPassword) == user.password){
          let user = new UserModel(this.loginService.getUserID(), this.loginService.getUsername(), this.loginService.getRole(), this.getHash(this.newPassword));
          this.userService.updateUser(user).subscribe(user => {
            this.loginService.logout();
          },() => {
            this.translateService.get('serverError').subscribe((text: string) => {
              window.alert(text);
            });
          });
        }else{
          this.translateService.get('wrongOldPassword').subscribe((text: string) => {
            window.alert(text);
          });
        }
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }
  }

  public deleteAccount(){
    this.userService.removeUserByID(this.loginService.getUserID()).subscribe(user => {
      this.loginService.logout();
    },() => {
      this.translateService.get('serverError').subscribe((text: string) => {
        window.alert(text);
      });
    });
  }

  cancelChangePassword() {
    this.oldPassword = "";
    this.newPassword = "";
    this.hideOldPassword = true;
    this.hideNewPassword = true;
    this.isChangePassword = false;
  }

  cancelDeleteAccount() {
    this.isDeleteAccount = false;
  }
}
