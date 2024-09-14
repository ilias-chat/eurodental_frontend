import { Injectable,signal } from "@angular/core";
import { Client } from "./client.model";

@Injectable({
    providedIn:'root'
})
export class ClientsService {
    private clients = signal<Client[]>([]);
    all_clients = this.clients.asReadonly();

    constructor(){
        this.clients.set(this.get_all());
    }

    get_all(){
        return [
            {
              id: 1,
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@example.com',
              phone_number: '+1-202-555-0171',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/men/1.jpg',
              adresse: '',
              city: 'Tanger'
            },
            {
              id: 2,
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane.smith@example.com',
              phone_number: '+1-202-555-0123',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/women/2.jpg',
              adresse: '',
              city: 'Tanger'
            },
            {
              id: 3,
              first_name: 'Emily',
              last_name: 'Johnson',
              email: 'emily.johnson@example.com',
              phone_number: '+1-202-555-0199',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/women/3.jpg',
              adresse: '',
              city: 'Casa'
            },
            {
              id: 4,
              first_name: 'Michael',
              last_name: 'Brown',
              email: 'michael.brown@example.com',
              phone_number: '+1-202-555-0184',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/men/4.jpg',
              adresse: '',
              city: 'Casa'
            },
            {
              id: 5,
              first_name: 'Sophia',
              last_name: 'Davis',
              email: 'sophia.davis@example.com',
              phone_number: '+1-202-555-0175',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/women/5.jpg',
              adresse: '',
              city: 'Rabat'
            },
            {
              id: 6,
              first_name: 'Liam',
              last_name: 'Wilson',
              email: 'liam.wilson@example.com',
              phone_number: '+1-202-555-0157',
              fixed_phone_number: '+05 67 87 89 09 78',
              image_path: 'https://randomuser.me/api/portraits/men/6.jpg',
              adresse: '',
              city: 'Tanger'
            }
        ];
          
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

}