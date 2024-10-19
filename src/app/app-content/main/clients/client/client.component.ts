import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
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

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  on_edit_btn_click(){
    this.edit.emit(this.client);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }
}
