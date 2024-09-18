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
  @ViewChild('form') client_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Client>();

  on_close(){
    this.close_dialog();
    this.client_form.nativeElement.reset()
    this.reset_selected_client();
  }

  open_dialog(){
    this.client_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.client_dialog.nativeElement.close();
  }

  on_save_btn_click(){
    this.submit.emit({ ...this.selected_client});
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
}
