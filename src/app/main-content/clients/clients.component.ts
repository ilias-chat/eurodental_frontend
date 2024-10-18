import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client } from './client.model';
import { ClientComponent } from './client/client.component';
import { ClientFormComponent } from "./client-form/client-form.component";
import { ToastsContainerComponent } from '../../shared/toasts-container/toasts-container.component';
import { ToastsService } from '../../shared/toasts-container/toast.service';
import { SkeletonRowListComponent } from '../../shared/skeletons/skeleton-row-list/skeleton-row-list.component';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ClientComponent, ClientFormComponent, ToastsContainerComponent, SkeletonRowListComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  private toasts_service = inject(ToastsService);
  private clients_service = inject(ClientsService);
  @ViewChild(ClientFormComponent) client_form_component!:ClientFormComponent;
  all_clients = signal<Client[]>([]);
  selected_clients_ids = signal<number[]>([]);

  current_page = signal<number>(1);
  lines_per_page:number = 10;
  total_pages = signal<number>(1);
  total_clients = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_city') combo_city!: ElementRef;

  is_loading = signal(false);
  is_error = signal(false);

  ngOnInit(){

    this.refresh_clients();

    this.reset_pagination();
  }

  refresh_clients(){
    
    this.is_loading.set(true);
    this.is_error.set(false);

    this.clients_service.all().subscribe({
      next:(respond_data)=>{
        this.all_clients.set(respond_data);
        this.clients_service.set_clients = respond_data;
        this.total_clients.set(this.all_clients().length);
        this.filter_clients();
        this.is_loading.set(false);
      },
      error:(err)=>{
        this.is_loading.set(false);
        this.is_error.set(true);
      },
    })
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
    this.all_clients.set(this.clients_service.filter(search_input_value,city_combo_value));
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
    this.all_clients.set(this.clients_service.filter('',''));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
  }

  on_form_submit(client_form_data:{form_data:FormData, client:Client}){

    this.client_form_component.show_progressbar();

    if(client_form_data.client.id === 0){
      this.clients_service.add(client_form_data.form_data)
      .subscribe({
        next:(respond_data)=>{
          this.toasts_service.add("Client have been created successfully", "success");
          client_form_data.client.id = (respond_data as Client).id;
          this.clients_service.add_client = client_form_data.client;
          this.filter_clients();
          this.reset_and_close_form();
          this.client_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.client_form_component.hide_progressbar();
          this.client_form_component.error_message.set(err.message);
          console.log(err);
        },
      });     
    } else {
      this.clients_service.edit(client_form_data.form_data, client_form_data.client.id).subscribe({
        next:(res)=>{
          this.toasts_service.add('Changes have been saved successfully','success');
          this.clients_service.edit_client = client_form_data.client;
          this.filter_clients();
          this.reset_and_close_form();
          this.client_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.client_form_component.hide_progressbar();
          this.client_form_component.error_message.set(err.message);
          console.log('edid error:',err);
        },
      });
    }
  }

  on_client_edit(client:Client){
    this.client_form_component.init_form(client);
    this.client_form_component.open_dialog();
  }

  on_client_selected_change(param_id:number){

    if (this.selected_clients_ids().includes(param_id)) {
      this.selected_clients_ids.set(
        this.selected_clients_ids().filter(id => id !== param_id)
      );
    }else{
      this.selected_clients_ids.set([...this.selected_clients_ids(), param_id]);
    }
  }

  on_list_options_close_btn_click(){
    this.selected_clients_ids.set([]);
  }

  reset_and_close_form(){
    this.client_form_component.on_close();
    this.client_form_component.reset_selected_client();
  }
}
