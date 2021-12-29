import { Component } from '@angular/core';
import {APPROUTES} from "../assets/constans/AppRoutes";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clocker';
  appRoutes = APPROUTES;

  getRole(): string | null{
    return localStorage.getItem("role");
  }
}
