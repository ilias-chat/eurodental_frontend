import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './client.model';
import { ClientComponent } from './client/client.component';
import { ClientFormComponent } from "./client-form/client-form.component";
import { ToastsContainerComponent } from '../../shared/toasts-container/toasts-container.component';
import { ToastsService } from '../../shared/toasts-container/toast.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientComponent, ClientFormComponent, ToastsContainerComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  private toasts_service = inject(ToastsService);
  private clientsService = inject(ClientsService);
  @ViewChild(ClientFormComponent) client_form_component!:ClientFormComponent;
  all_clients = signal<Client[]>([]);
  selected_clients_ids = signal<number[]>([1,16,17,2]);

  current_page = signal<number>(1);
  lines_per_page:number = 10;
  total_pages = signal<number>(1);
  total_clients = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_city') combo_city!: ElementRef;

  ngOnInit(){

    this.clientsService.all().subscribe({
      next:(respond_data)=>{
        this.all_clients.set(respond_data);
        this.total_clients.set(respond_data.length);
        this.filter_clients();
      },
      error(err) {
        //this.toasts_service.add(err.message, "danger");
      },
    })

    this.reset_pagination();
   }

  get clients(): Client[] {
    return this.all_clients().slice(this.start_index(), this.end_index());
  }

  on_next_btn_clicked(){
    if(this.current_page()==this.total_pages()) return;
    this.current_page.set(this.current_page()+1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  on_previous_btn_clicked(){
    if(this.current_page()==1) return;
    this.current_page.set(this.current_page()-1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  open_form_dialog(){
    this.client_form_component.open_dialog();
  }

  on_add_client(){
    this.open_form_dialog()
  }

  on_search_input_keyup(){
    this.filter_clients();
  }

  on_combo_city_change(){
    this.filter_clients();
  }

  filter_clients(){
    const search_input_value = this.search_input.nativeElement.value;
    const city_combo_value = this.combo_city.nativeElement.value;
    this.all_clients.set(this.clientsService.filter(search_input_value,city_combo_value));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_pagination();
  }

  reset_pagination(){
    this.total_clients.set(this.all_clients().length);
    if(this.total_clients() % this.lines_per_page == 0)
      this.total_pages.set(this.total_clients()/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(this.total_clients()/this.lines_per_page)+1);

    if (this.total_pages() === 0) this.total_pages.set(1);
  }

  on_reset_filter_click(){
    this.reset_filter();
    this.reset_pagination();
  }

  reset_filter(){
    this.search_input.nativeElement.value = '';
    this.combo_city.nativeElement.value = '';
    this.all_clients.set(this.clientsService.filter('',''));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
  }

  on_form_submit(client:Client){
    if(client.id === 0){
      this.clientsService.add(client)
      .subscribe({
        next:(respond_data)=>{
          this.toasts_service.add("Client have been created successfully", "success");
          client.id = (respond_data as Client).id;
          this.clientsService.add_client = client;
          this.filter_clients();
        },
        error:(err)=>{
          this.toasts_service.add(err.message, "danger");
        },
      });     
    } else {
      this.clientsService.edit(client).subscribe({
        next:(res)=>{
          console.log(res);
          this.toasts_service.add('Changes have been saved successfully','success');
          this.clientsService.edit_client = client;
          this.filter_clients();
        },
        error:(err)=>{
          this.toasts_service.add(err.message,'danger');
          //console.log('edid error:',err);
        },
      });
    }

  }

  on_client_edit(client:Client){
    this.client_form_component.init_form(client);
    this.client_form_component.open_dialog();
  }

  on_client_selected_change(param_id:number){

    console.log(param_id);
    if (this.selected_clients_ids().includes(param_id)) {
      this.selected_clients_ids.set(
        this.selected_clients_ids().filter(id => id !== param_id)
      );
    }else{
      this.selected_clients_ids.set([...this.selected_clients_ids(), param_id])
    }
  }

  on_list_options_close_btn_click(){
    this.selected_clients_ids.set([]);
  }
}
