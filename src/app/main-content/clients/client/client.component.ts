import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Client } from '../client.model';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  @Input({required:true}) client!:Client;
  @Output() edit = new EventEmitter<Client>();

  on_edit_btn_click(){
    this.edit.emit(this.client);
  }
}
