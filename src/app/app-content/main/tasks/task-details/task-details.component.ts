import { Component, inject, Input, signal } from '@angular/core';
import { Task_details, TasksService } from '../tasks.service';
import { ToastsService } from '../../../../shared/toasts-container/toast.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  //task_id:number = 0;

  private toasts_service = inject(ToastsService);
  private tasks_service = inject(TasksService);

  task_details = signal<Task_details>(this.get_empty_task());

  is_open = signal(false);

  on_close_btn_click(){
    this.is_open.set(false);
    this.init_task(0);
  }

  open_task_details(task_id:number){
    this.is_open.set(true);
    this.init_task(task_id);
  }

  init_task(task_id:number = 0){
    console.log(task_id);
    if (task_id == 0){
      this.task_details.set(this.get_empty_task()) 
    }else{
      console.log('loading');
        this.tasks_service.get_by_id(task_id).subscribe({
          next:(res_data)=>{
            console.log('done');
            console.log(res_data);
            this.task_details.set(res_data);
          },
          error:(res_err)=>{
            this.toasts_service.add(res_err.message, 'danger');
          },
        })
    }
  }

  get_empty_task(){
    return {
      id: 0,
      task_name: '',
      task_type: '',
      description: '',
      technician_id: 0,
      task_date: '',
      observation: '',
      create_by: 0,
      client_id: 0,
      status: '',
      client: null,
      technician: null,
      products: [],
    }
  }

}
