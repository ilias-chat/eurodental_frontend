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
  clients = signal<Client[]>([]);
  is_form_dialog_open:boolean = false;

  ngOnInit(){
    this.clients.set(this.clientsService.all_clients());
  }

  open_form_dialog(){
    //this.is_form_dialog_open = true;
    this.client_form_component.open_dialog();
  }

  close_form_dialog(){
    this.is_form_dialog_open = false;
  }

  on_add_client(){
    this.open_form_dialog()
  }
}
