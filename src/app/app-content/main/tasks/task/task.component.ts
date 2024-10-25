import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task } from '../task.model';
import { AuthService } from '../../../../authentification/auth.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  auth_service = inject(AuthService);
  @Input({required:true}) task!:Task;
  @Output() edit = new EventEmitter<Task>();

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  @Output() show_details = new EventEmitter<void>();

  on_edit_btn_click(){
    this.edit.emit(this.task);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }

  on_details_btn_click(){
    this.show_details.emit();
  }
}
