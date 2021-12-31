import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {StatsModel} from "../Models/stats.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ClientModel, ClientModelRequest} from "../Models/client.model";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private httpClient: HttpClient) {
  }


}
