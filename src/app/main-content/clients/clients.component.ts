import { Component, ViewChild, inject, signal } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './client.model';
import { ClientComponent } from './client/client.component';
import { ClientFormComponent } from "./client-form/client-form.component";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientComponent, ClientFormComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  private clientsService = inject(ClientsService);
  @ViewChild(ClientFormComponent) client_form_component!:ClientFormComponent;
  all_clients!:Client[];
  clients = signal<Client[]>([]);
  current_page = signal<number>(1);
  lines_per_page:number = 2;
  total_pages = signal<number>(1);

  ngOnInit(){
    this.all_clients = this.clientsService.all_clients();

    this.clients.set(this.all_clients.slice(0, this.lines_per_page));
    let total_clients = this.all_clients.length;
    if(total_clients % this.lines_per_page == 0)
      this.total_pages.set(total_clients/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(total_clients/this.lines_per_page)+1);
  }

  on_next_btn_clicked(){
    if(this.current_page()==this.total_pages()) return;
    this.current_page.set(this.current_page()+1);
    let starting_index = this.lines_per_page*(this.current_page()-1);
    let ending_index = starting_index + this.lines_per_page;
    //console.log('start: '+starting_index,'end: '+ending_index);
    this.clients.set(this.all_clients.slice(starting_index, ending_index));
  }

  on_previous_btn_clicked(){
    if(this.current_page()==1) return;
    this.current_page.set(this.current_page()-1);
    let starting_index = this.lines_per_page*(this.current_page()-1);
    let ending_index = starting_index + this.lines_per_page;
    //console.log('start: '+starting_index,'end: '+ending_index);
    this.clients.set(this.all_clients.slice(starting_index, ending_index));
  }

  open_form_dialog(){
    this.client_form_component.open_dialog();
  }

  on_add_client(){
    this.open_form_dialog()
  }
}
