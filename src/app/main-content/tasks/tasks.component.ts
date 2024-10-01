import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ToastsService } from '../../shared/toasts-container/toast.service';
import { TasksService } from './tasks.service';
import { TaskFormComponent } from './task-form/task-form.component';
import { Task } from './task.model';
import { TaskComponent } from './task/task.component';
import { TaskDetailsComponent } from "./task-details/task-details.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskFormComponent, TaskComponent, TaskDetailsComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  private toasts_service = inject(ToastsService);
  private tasks_service = inject(TasksService);
  @ViewChild(TaskFormComponent) task_form_component!:TaskFormComponent;
  @ViewChild(TaskDetailsComponent) task_details_component!:TaskDetailsComponent;
  all_tasks = signal<Task[]>([]);
  selected_tasks_ids = signal<number[]>([]);

  current_page = signal<number>(1);
  lines_per_page:number = 10;
  total_pages = signal<number>(1);
  total_tasks = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('client_search_input') client_search_input!: ElementRef;
  @ViewChild('technician_search_input') technician_search_input!: ElementRef;
  @ViewChild('combo_status') combo_status!: ElementRef;

  ngOnInit(){

    // this.tasks_service.all().subscribe({
    //   next:(respond_data)=>{
    //     this.all_tasks.set(respond_data);
    //     this.total_tasks.set(respond_data.length);
    //     this.filter_tasks();
    //   },
    //   error:(err)=>{
    //     this.toasts_service.add(err.message, "danger");
    //   },
    // });

    this.all_tasks.set(this.tasks_service.all());

    this.reset_pagination();
   }

  get tasks(): Task[] {
    return this.all_tasks().slice(this.start_index(), this.end_index());
  }

  on_next_btn_clicked(){
    if(this.current_page()==this.total_pages()) return;
    this.current_page.set(this.current_page()+1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  on_previous_btn_clicked(){
    if(this.current_page()==1) return;
    this.current_page.set(this.current_page()-1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  open_form_dialog(){
    this.task_form_component.open_dialog();
  }

  on_add_task(){
    this.open_form_dialog()
  }

  on_search_input_keyup(){
    this.filter_tasks();
  }

  on_combo_status_change(){
    this.filter_tasks();
  }

  filter_tasks(){
    const client_search_input = this.client_search_input.nativeElement.value;
    const technician_search_input = this.technician_search_input.nativeElement.value;
    const status_combo_value = this.combo_status.nativeElement.value;
    this.all_tasks.set(this.tasks_service.filter(technician_search_input, client_search_input, status_combo_value));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_pagination();
  }

  reset_pagination(){
    this.total_tasks.set(this.all_tasks().length);
    if(this.total_tasks() % this.lines_per_page == 0)
      this.total_pages.set(this.total_tasks()/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(this.total_tasks()/this.lines_per_page)+1);

    if (this.total_pages() === 0) this.total_pages.set(1);
  }

  on_reset_filter_click(){
    this.reset_filter();
    this.reset_pagination();
  }

  reset_filter(){
    this.client_search_input.nativeElement.value = '';
    this.technician_search_input.nativeElement.value = '';
    this.combo_status.nativeElement.value = '';
    this.all_tasks.set(this.tasks_service.filter('','',''));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
  }

  on_form_submit(task:Task){
    this.task_form_component.show_progressbar();
    if(task.id === 0){
      this.tasks_service.add(task)
      .subscribe({
        next:(respond_data)=>{
          this.toasts_service.add("task have been created successfully", "success");
          task.id = (respond_data as Task).id;
          this.tasks_service.add_task = task;
          this.filter_tasks();
          this.reset_and_close_form();
          this.task_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.toasts_service.add(err.message, "danger");
          this.task_form_component.hide_progressbar();
        },
      });     
    } else {
      this.tasks_service.edit(task).subscribe({
        next:(res)=>{
          console.log(res);
          this.toasts_service.add('Changes have been saved successfully','success');
          this.tasks_service.edit_task = task;
          this.filter_tasks();
          this.reset_and_close_form();
          this.task_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.toasts_service.add(err.message,'danger');
          this.task_form_component.hide_progressbar();
          //console.log('edid error:',err);
        },
      });
    }
  }

  on_task_edit(task:Task){
    this.task_form_component.init_form(task);
    this.task_form_component.open_dialog();
  }

  on_task_selected_change(param_id:number){

    if (this.selected_tasks_ids().includes(param_id)) {
      this.selected_tasks_ids.set(
        this.selected_tasks_ids().filter(id => id !== param_id)
      );
    }else{
      this.selected_tasks_ids.set([...this.selected_tasks_ids(), param_id])
    }
  }

  on_list_options_close_btn_click(){
    this.selected_tasks_ids.set([]);
  }

  reset_and_close_form(){
    this.task_form_component.on_close();
    this.task_form_component.reset_selected_task();
  }

  on_show_details(task_id:number){
    this.task_details_component.open_task_details(task_id);
  }
}
