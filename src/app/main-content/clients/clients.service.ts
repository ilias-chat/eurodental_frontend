import { Injectable,inject,signal } from "@angular/core";
import { Client } from "./client.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthentificationService } from "../../authentification/authentification.service";

@Injectable({
    providedIn:'root'
})
export class ClientsService {
  private clients = signal<Client[]>([]);
  all_clients = this.clients.asReadonly();

  private http_client = inject(HttpClient);
  private authentifiction_servise = inject(AuthentificationService);
  private api_url = this.authentifiction_servise.get_api_url + '/clients';
  
  public set set_clients(clients:Client[]) {
    this.clients.set(clients);
  }

  all():Observable<Client[]>{
    return this.http_client.get<Client[]>(this.api_url);
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
    return this.http_client.post(this.api_url, client);
  }

  edit(client:FormData, client_id:number):Observable<Object>{
    return this.http_client.put(this.api_url+'/'+client_id, client);
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