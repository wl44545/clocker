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
    return this.httpClient.get<ClientModel[]>(`${environment.apiUrl}/clients?user=${user}`, this.loginService.getAuthorizedOptions());
  }

  public getClient(id: number): Observable<ClientModel> {
    return this.httpClient.get<ClientModel>(`${environment.apiUrl}/clients/${id}`, this.loginService.getAuthorizedOptions());
  }

  public addClient(clientName: string, user: number): Observable<ClientModel> {
    return this.httpClient.post<ClientModel>(`${environment.apiUrl}/clients`, new ClientModelRequest(clientName, user), this.loginService.getAuthorizedOptions());
  }

  public editClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.put<ClientModel>(`${environment.apiUrl}/clients/${client.id}`, client, this.loginService.getAuthorizedOptions());
  }

  public removeClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.delete<ClientModel>(`${environment.apiUrl}/clients/${client.id}`, this.loginService.getAuthorizedOptions());
  }
}
