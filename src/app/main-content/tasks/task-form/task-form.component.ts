import { Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';
import { TechnitiansComboboxComponent } from "../../../shared/technitians-combobox/technitians-combobox.component";
import { ClientsComboboxComponent } from './clients-combobox/clients-combobox.component';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, TechnitiansComboboxComponent, ClientsComboboxComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  error_message = signal('');
  invalid_inputs = signal<string[]>([])
  selected_task:Task = this.get_empty_task();
  @ViewChild('dialog') task_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') task_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Task>();

  is_progressbar_open:boolean = false;

  on_close(){
    this.close_dialog();
    this.reset_selected_task();
    this.clear_error_message();
  }

  open_dialog(){
    this.task_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.task_dialog.nativeElement.close();
  }

  on_save_btn_click(){

    this.error_message.set('');
    this.invalid_inputs.set([]);

    if(!this.selected_task.task_name)
      this.invalid_inputs.set([...this.invalid_inputs(), 'task_name']);
    if(!this.selected_task.task_date)
      this.invalid_inputs.set([...this.invalid_inputs(), 'task_date']);
    if(!this.selected_task.client_id)
      this.invalid_inputs.set([...this.invalid_inputs(), 'client']);

    if(this.invalid_inputs().length > 0) return;

    this.submit.emit({ ...this.selected_task});
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
      task_date: this.format_date_to_yyyy_mm_dd(new Date()),
      created_by:0,
      observation:'',
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

  on_clients_combo_change(client:{id:number,full_name:string, image_path:string}){
    this.selected_task.client_id = client.id;
    this.selected_task.client = client.full_name;
    this.selected_task.client_image = client.image_path;
  }

  clear_error_message(){
    this.error_message.set('');
  }
}

 