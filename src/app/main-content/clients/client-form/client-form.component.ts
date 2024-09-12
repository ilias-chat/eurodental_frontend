import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  @ViewChild('dialog') client_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') client_form!:ElementRef<HTMLFormElement>;

  on_close(){
    this.close_dialog();
    this.client_form.nativeElement.reset();
  }

  open_dialog(){
    this.client_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.client_dialog.nativeElement.close();
  }
}
