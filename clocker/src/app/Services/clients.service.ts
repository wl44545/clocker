import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ClientModel, ClientModelRequest} from "../Models/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private httpClient: HttpClient) {
  }

  public getClients(username: string): Observable<ClientModel[]> {
    return this.httpClient.get<ClientModel[]>(`${environment.apiUrl}/clients?username=${username}`);
  }

  public getClient(id: number): Observable<ClientModel> {
    return this.httpClient.get<ClientModel>(`${environment.apiUrl}/clients/${id}`);
  }

  public addClient(clientName: string, username: string): Observable<ClientModel> {
    return this.httpClient.post<ClientModel>(`${environment.apiUrl}/clients`, new ClientModelRequest(clientName, username));
  }

  public editClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.put<ClientModel>(`${environment.apiUrl}/clients/${client.id}`, client);
  }

  public removeClient(client: ClientModel): Observable<ClientModel>{
    return this.httpClient.delete<ClientModel>(`${environment.apiUrl}/clients/${client.id}`);
  }
}
