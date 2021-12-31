import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../Services/login.service";
import {Router} from "@angular/router";
import {ClientsService} from "../../Services/clients.service";
import {ClientModel} from "../../Models/client.model";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clientName: string = "";
  clients: ClientModel[] = [];
  client: ClientModel = new ClientModel(0,'','');
  clientEdit: boolean = false;

  constructor(private loginService: LoginService,
              private router: Router,
              private clientService: ClientsService) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getClients();
  }

  private checkPermission(){
    if(!this.loginService.isUser()){
      this.router.navigateByUrl('/').then();
    }
  }

  public addClient(){
    if(this.clientName != "") {
      this.clientService.addClient(this.clientName, this.loginService.getUsername()).subscribe(client => {
        this.clientName = "";
        this.getClients();
      });
    }
  }

  public removeClient(client: ClientModel){
    this.clientService.removeClient(client).subscribe(client => {
      this.clientName = "";
      this.clientEdit = false;
      this.getClients();
    });
  }

  public getClients(){
    this.clientService.getClients(this.loginService.getUsername()).subscribe(clients => {
      this.clients = clients;
    })
  }

  public editClient(client: ClientModel){
    this.client = client;
    this.clientName = client.name;
    this.clientEdit = true;
  }

  public saveClient() {
    this.client.name = this.clientName;
    this.clientService.editClient(this.client).subscribe(client => {
      this.clientName = "";
      this.clientEdit = false;
      this.getClients();
    });
  }
}
