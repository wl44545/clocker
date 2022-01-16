import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StartPageComponent} from './Components/start-page/start-page.component';
import {FormsModule} from "@angular/forms";
import {LoginService} from "./Services/login.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {StatsService} from "./Services/stats.service";
import {TimerComponent} from './Components/timer/timer.component';
import {ProjectsComponent} from './Components/projects/projects.component';
import {ClientsComponent} from './Components/clients/clients.component';
import {ReportsComponent} from './Components/reports/reports.component';
import {AdminComponent} from './Components/admin/admin.component';
import {UsersComponent} from './Components/users/users.component';
import {Angular2CsvModule} from "angular2-csv";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import { SettingsComponent } from './Components/settings/settings.component';
import { AccountComponent } from './Components/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    TimerComponent,
    ProjectsComponent,
    ClientsComponent,
    ReportsComponent,
    AdminComponent,
    UsersComponent,
    SettingsComponent,
    AccountComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        Angular2CsvModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpTranslateLoader,
            deps: [HttpClient]
         }
       })
    ],
  providers: [
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    LoginService,
    StatsService,
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
