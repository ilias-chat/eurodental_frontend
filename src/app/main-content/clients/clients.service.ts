import { Injectable,inject,signal } from "@angular/core";
import { Client } from "./client.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ClientsService {
    private clients = signal<Client[]>([]);
    all_clients = this.clients.asReadonly();

    private http_client = inject(HttpClient);
    private api_url = 'http://35.180.66.24';

  constructor(){    

  }

  
  public set set_clients(clients:Client[]) {
    this.clients.set(clients);
  }
  
  

  all():Observable<Client[]>{
    return this.http_client.get<Client[]>('http://35.180.66.24/clients');
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

  add(client:Client):Observable<Object>{
    return this.http_client.post(this.api_url + '/clients', client);
  }

  edit(client:Client):Observable<Object>{
    return this.http_client.put(this.api_url+'/clients/'+client.id, client);
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