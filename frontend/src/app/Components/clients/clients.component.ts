import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {ClientsService} from "../../Services/clients.service";
import {ClientModel} from "../../Models/client.model";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {ComponentService} from "../../Services/component.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clientName: string = "";
  clients: ClientModel[] = [];
  client: ClientModel = new ClientModel(0,'',0);
  clientEdit: boolean = false;

  constructor(private loginService: LoginService,
              private router: Router,
              private clientService: ClientsService,
              private translateService: TranslateService,
              private componentService: ComponentService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getClients();
    this.componentService.setComponent('ClientsComponent');
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  public addClient(){
    if(this.clientName != "") {
      this.clientService.addClient(this.clientName, this.loginService.getUserID()).subscribe(client => {
        this.clientName = "";
        this.getClients();
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }
  }

  public removeClient(client: ClientModel){
    this.clientService.removeClient(client).subscribe(client => {
      this.getClients();
      this.clearInput();
    });
  }

  public getClients(){
    this.clientService.getClients(this.loginService.getUserID()).subscribe(clients => {
      this.clients = clients;
    },() => {
        this.translateService.get('serverError').subscribe((text:string) => {
          window.alert(text);
        });
      })
  }

  public editClient(client: ClientModel){
    this.client = client;
    this.clientName = client.name;
    this.clientEdit = true;
  }

  public saveClient() {
    if(this.clientName != "") {
      this.client.name = this.clientName;
      this.clientService.editClient(this.client).subscribe(client => {
        this.getClients();
        this.clearInput();
      },() => {
        this.translateService.get('serverError').subscribe((text: string) => {
          window.alert(text);
        });
      });
    }
  }

  private clearInput(){
    this.clientName = "";
    this.clientEdit = false;
  }
}
