import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '../client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  selected_client:Client = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    fixed_phone_number: '',
    city: '',
    adresse: '',
    image_path: '',
  };
  @ViewChild('dialog') client_dialog!:ElementRef<HTMLDialogElement>;
  // @ViewChild('form') client_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Client>();

  // inpute variables
  entered_firstname:string='';
  entered_lastname:string='';
  entered_email:string='';
  entered_phone_number:string='';
  entered_fixed_number:string='';
  entered_adresse:string='';
  entered_city:string='';
  entered_image_path:string='';

  ngOnInit(){
    //this.selected_client.first_name = 'haha';
  }

  on_close(){
    this.close_dialog();
    this.reset_selected_client();
  }

  open_dialog(){
    this.client_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.client_dialog.nativeElement.close();
  }

  on_save_btn_click(){
    this.submit.emit(this.selected_client);
    this.on_close();
    this.reset_selected_client();
  }

  reset_selected_client(){
    this.selected_client = {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      fixed_phone_number: '',
      city: '',
      adresse: '',
      image_path: '',
    };
  }

  init_form(client:Client){
    this.selected_client = client;
  }
}
