import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {APPROUTES} from "../assets/constants/AppRoutes";
import {StartPageComponent} from "./Components/start-page/start-page.component";
import {AdminComponent} from "./Components/admin/admin.component";
import {TimerComponent} from "./Components/timer/timer.component";
import {ProjectsComponent} from "./Components/projects/projects.component";
import {ClientsComponent} from "./Components/clients/clients.component";
import {ReportsComponent} from "./Components/reports/reports.component";
import {UsersComponent} from "./Components/users/users.component";

const routes: Routes = [
  { path: APPROUTES.HOME, pathMatch: 'full', component: StartPageComponent },
  { path: APPROUTES.ADMIN, component: AdminComponent },
  { path: APPROUTES.USERS, component: UsersComponent },
  { path: APPROUTES.TIMER, component: TimerComponent },
  { path: APPROUTES.PROJECTS, component: ProjectsComponent },
  { path: APPROUTES.CLIENTS, component: ClientsComponent },
  { path: APPROUTES.REPORTS, component: ReportsComponent },
  { path: '**', component: StartPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
