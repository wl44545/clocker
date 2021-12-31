import { Component } from '@angular/core';
import {APPROUTES} from "../assets/constans/AppRoutes";
import {LoginService} from "./Services/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clocker';
  appRoutes = APPROUTES;

  constructor(public loginService: LoginService) { }


}
