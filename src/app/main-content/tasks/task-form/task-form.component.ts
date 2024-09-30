import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  selected_task:Task = this.reset_task();
  @ViewChild('dialog') task_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') task_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Task>();

  is_progressbar_open:boolean = false;

  on_close(){
    this.close_dialog();
    this.reset_selected_task();
    this.task_form.nativeElement.reset();
  }

  open_dialog(){
    this.task_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.task_dialog.nativeElement.close();
  }

  on_save_btn_click(){
    this.submit.emit({ ...this.selected_task});
  }

  reset_selected_task(){
    this.selected_task = this.reset_task();
  }

  reset_task():Task{
    return {
      id:0,
      task_name:'',
      task_type:'',
      description:'',
      status:'',
      technician_id:0,
      technician:'',
      technician_image_path:'',
      client_id:0,
      client:'',
      client_image_path:'',
      task_date:''
    }
  }

  init_form(task:Task){
    this.selected_task = { ...task };
  }

  on_img_selector_dragover(event:DragEvent){
    event.preventDefault();
  }

  show_progressbar(){
    this.is_progressbar_open = true;
  }

  hide_progressbar(){
    this.is_progressbar_open = false;
  }
}
