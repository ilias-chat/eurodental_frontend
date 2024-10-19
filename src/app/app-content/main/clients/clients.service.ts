import { Injectable,inject,signal } from "@angular/core";
import { Client } from "./client.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

@Injectable({
    providedIn:'root'
})
export class ClientsService {
  private clients = signal<Client[]>([]);
  all_clients = this.clients.asReadonly();

  private http_client = inject(HttpClient);
  private http_service = inject(HttpService);
  
  private api_url = this.http_service.api_url + '/clients';
  
  public set set_clients(clients:Client[]) {
    this.clients.set(clients);
  }

  all():Observable<Client[]>{
    return this.http_client.get<Client[]>(this.api_url).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  filter(name:string, city:string){
    if(name != '' && city != ''){
      return this.clients().filter((client)=>{
        return (client.first_name.toLowerCase().includes(name) || client.last_name.toLowerCase().includes(name))
          && client.city.toLowerCase() === city.toLowerCase();
      });
    } else if (name != ''){
      return this.clients().filter((client)=>{
        return (client.first_name.toLowerCase().includes(name) || client.last_name.toLowerCase().includes(name));
      });
    } else if (city != ''){
      return this.clients().filter((client)=>{
        return client.city.toLowerCase() === city.toLowerCase();
      });
    }
    else return this.clients();
  }

  add(client:FormData):Observable<Object>{
    return this.http_client.post(this.api_url, client).pipe(
      catchError(this.http_service.handle_error)
    );;
  }

  edit(client:FormData, client_id:number):Observable<Object>{
    return this.http_client.put(this.api_url+'/'+client_id, client).pipe(
      catchError(this.http_service.handle_error)
    );;
  }
  
  public set add_client(client:Client) {
    this.clients.set([...this.clients(), client]);
  }

  public set edit_client(client:Client) {
     this.clients.set(
      this.clients().map((cl) => {
        if (cl.id === client.id) {
          return client;
        }
        return cl;
      })
    ); 
  }
  

}