import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, input } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';
import { TechnitiansComboboxComponent } from "./technitians-combobox/technitians-combobox.component";


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, TechnitiansComboboxComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  selected_task:Task = this.get_empty_task();
  @ViewChild('dialog') task_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') task_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Task>();

  is_progressbar_open:boolean = false;

  on_close(){
    this.close_dialog();
    this.reset_selected_task();
    //this.task_form.nativeElement.reset();
  }

  open_dialog(){
    this.task_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.task_dialog.nativeElement.close();
  }

  on_save_btn_click(){
    console.log(this.selected_task);

    //this.submit.emit({ ...this.selected_task});
  }

  reset_selected_task(){
    this.selected_task = this.get_empty_task();
  }

  get_empty_task():Task{
    return {
      id:0,
      task_name:'',
      task_type:'',
      description:'',
      status:'',
      technician_id:0,
      technician:'',
      technician_image:'',
      client_id:0,
      client:'',
      client_image:'',
      task_date: undefined,
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

  format_date_to_yyyy_mm_dd(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  on_technicians_combo_change(technician:{id:number,full_name:string, image_path:string}){
    this.selected_task.technician_id = technician.id;
    this.selected_task.technician = technician.full_name;
    this.selected_task.technician_image = technician.image_path;
  }
}

 