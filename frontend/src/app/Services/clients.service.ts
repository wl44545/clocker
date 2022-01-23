import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ClientModel, ClientModelRequest} from "../Models/client.model";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private httpClient: HttpClient,
              private loginService: LoginService) {
  }

  public getClients(user: number): Observable<ClientModel[]> {
    return this.httpClient.get<ClientModel[]>(`${environment.apiUrl}/client/getclientbyuser/${user}`, this.loginService.getAuthorizedOptions());
  }

  public getClient(id: number): Observable<ClientModel> {
    return this.httpClient.get<ClientModel>(`${environment.apiUrl}/client/getclient/${id}`, this.loginService.getAuthorizedOptions());
  }

  public addClient(clientName: string, user: number): Observable<ClientModel> {
    return this.httpClient.post<ClientModel>(`${environment.apiUrl}/client/addclient/${clientName}/${user}`, new ClientModelRequest(clientName, user), this.loginService.getAuthorizedOptions());
  }

  public editClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.put<ClientModel>(`${environment.apiUrl}/client/updateclient/${client.id}/${client.name}/${client.user}`, client, this.loginService.getAuthorizedOptions());
  }

  public removeClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.delete<ClientModel>(`${environment.apiUrl}/client/removeclient/${client.id}`, this.loginService.getAuthorizedOptions());
  }
}
