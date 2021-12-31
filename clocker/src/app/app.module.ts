import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './Components/start-page/start-page.component';
import {FormsModule} from "@angular/forms";
import {LoginService} from "./Services/login.service";
import {HttpClientModule} from "@angular/common/http";
import {StatsService} from "./Services/stats.service";
import { TimerComponent } from './Components/timer/timer.component';
import { ProjectsComponent } from './Components/projects/projects.component';
import { ClientsComponent } from './Components/clients/clients.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { AdminComponent } from './Components/admin/admin.component';
import { UsersComponent } from './Components/users/users.component';
import {Angular2CsvModule} from "angular2-csv";

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    TimerComponent,
    ProjectsComponent,
    ClientsComponent,
    ReportsComponent,
    AdminComponent,
    UsersComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        Angular2CsvModule
    ],
  providers: [
    LoginService,
    StatsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
