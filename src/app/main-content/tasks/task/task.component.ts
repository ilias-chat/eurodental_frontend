import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input({required:true}) task!:Task;
  @Output() edit = new EventEmitter<Task>();

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  on_edit_btn_click(){
    this.edit.emit(this.task);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }
}
