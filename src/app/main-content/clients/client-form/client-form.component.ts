import { Component, ElementRef, Output, ViewChild, EventEmitter, signal } from '@angular/core';
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
    address: '',
    image_path: '',
    description: '',
  };
  @ViewChild('dialog') client_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') client_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<{form_data:FormData, client:Client}>();

  is_progressbar_open = signal(false);

  on_close(){
    this.close_dialog();
    this.reset_selected_client();
    this.client_form.nativeElement.reset();
  }

  open_dialog(){
    this.client_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.client_dialog.nativeElement.close();
  }

  on_save_btn_click(img_input:HTMLInputElement){
    const form_data = new FormData();
    form_data.append('first_name', this.selected_client.first_name);
    form_data.append('last_name', this.selected_client.last_name);
    form_data.append('email', this.selected_client.email);
    form_data.append('phone_number', this.selected_client.phone_number);
    form_data.append('fixed_phone_number', this.selected_client.fixed_phone_number);
    form_data.append('description', this.selected_client.description);
    form_data.append('city', this.selected_client.city);
    form_data.append('address', this.selected_client.address);
    if(img_input?.files && img_input?.files[0]){
      form_data.append('image', img_input.files[0]);
    }

    this.submit.emit({form_data:form_data, client:this.selected_client});
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
      address: '',
      image_path: '',
      description: ''
    };
  }

  init_form(client:Client){
    this.selected_client = { ...client };
  }

  on_img_input_change(event:Event){
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      this.selected_client.image_path = URL.createObjectURL(input.files[0]);
    }
  }

  on_img_selector_dragover(event:DragEvent){
    event.preventDefault();
  }

  on_img_selector_drop(event:DragEvent, img_input:HTMLInputElement){
    event.preventDefault();

    // Access the dataTransfer object
    const files = event.dataTransfer?.files;

    if (files) {
      img_input.files = files;
      this.selected_client.image_path = URL.createObjectURL(img_input.files[0]);
    }
  }

  show_progressbar(){
    this.is_progressbar_open.set(true);
  }

  hide_progressbar(){
    this.is_progressbar_open.set(false);
  }
}
