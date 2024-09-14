import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
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
  lines_per_page:number = 5;
  total_pages = signal<number>(1);
  total_clients = signal<number>(0);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_city') combo_city!: ElementRef;

  ngOnInit(){
    this.all_clients = this.clientsService.filter('','');

    this.reset_clients_list();
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

  on_search_input_keyup(){
    const search_input_value = this.search_input.nativeElement.value;
    const city_combo_value = this.combo_city.nativeElement.value;
    this.all_clients = this.clientsService.filter(search_input_value,city_combo_value);

    this.reset_clients_list();
  }

  on_combo_city_change(){
    const search_input_value = this.search_input.nativeElement.value;
    const city_combo_value = this.combo_city.nativeElement.value;
    this.all_clients = this.clientsService.filter(search_input_value,city_combo_value);

    this.reset_clients_list();
  }

  reset_clients_list(){
    this.current_page.set(1);
    this.clients.set(this.all_clients.slice(0, this.lines_per_page));
    
    this.total_clients.set(this.all_clients.length);
    if(this.total_clients() % this.lines_per_page == 0)
      this.total_pages.set(this.total_clients()/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(this.total_clients()/this.lines_per_page)+1);

    if (this.total_pages() === 0) this.total_pages.set(1);
  }

  on_reset_filter_click(){
    this.search_input.nativeElement.value = '';
    this.combo_city.nativeElement.value = '';

    this.all_clients = this.clientsService.filter('','');
    this.reset_clients_list();
  }
}
