import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {APPROUTES} from "../assets/constans/AppRoutes";
import {StartPageComponent} from "./Components/start-page/start-page.component";

const routes: Routes = [
  { path: APPROUTES.HOME, pathMatch: 'full', component: StartPageComponent},
  { path: APPROUTES.ADMIN, component: StartPageComponent},
  { path: APPROUTES.USER_LIST, component: StartPageComponent},
  { path: '**', component: StartPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
