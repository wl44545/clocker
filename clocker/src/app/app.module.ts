import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './Components/start-page/start-page.component';
import {FormsModule} from "@angular/forms";
import {LoginService} from "./Services/login.service";
import {HttpClientModule} from "@angular/common/http";
import {StatsService} from "./Services/stats.service";

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
  providers: [
    LoginService,
    StatsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
