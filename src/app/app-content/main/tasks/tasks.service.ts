import { Injectable,inject,signal } from "@angular/core";
import { Task } from "./task.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap } from "rxjs";
import { HttpService } from "../../../shared/http.service";

@Injectable({
    providedIn:'root'
})
export class TasksService {
  private tasks = signal<Task[]>([]);
  all_tasks = this.tasks.asReadonly();

  private http = inject(HttpClient);
  private http_service = inject(HttpService);
  private api_url = this.http_service.api_url + '/tasks/';

  all(params:{start_date:string, end_date:string}):Observable<Task[]>{
    let url = this.api_url
    if(params.start_date !== '' && params.end_date !== ''){
      url += '?date_range_start=' + params.start_date + '&date_range_end=' + params.end_date;
    }else if(params.start_date !== ''){
      url += "?exact_date=" + params.start_date; 
    }
    return this.http.get<Task[]>(url).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  filter(technician:string, client:string, status:string){
    if(technician != '' && client != '' && status != ''){
      return this.tasks().filter((task)=>{
        return (task.technician.toLowerCase().includes(technician)) && (task.client.toLowerCase().includes(client)) && task.status.toLowerCase() === status.toLowerCase();
      });
    } else if (technician != '' && client != ''){
      return this.tasks().filter((task)=>{
        return (task.technician.toLowerCase().includes(technician)) && (task.client.toLowerCase().includes(client));
      });
    } else if (technician != '' && status != ''){
        return this.tasks().filter((task)=>{
          return (task.technician.toLowerCase().includes(technician)) && task.status.toLowerCase() === status.toLowerCase();
        });
    } else if (client != '' && status != ''){
        return this.tasks().filter((task)=>{
          return (task.client.toLowerCase().includes(client)) && task.status.toLowerCase() === status.toLowerCase();
        });
    } else if (technician != ''){
      return this.tasks().filter((task)=>{
        return (task.technician.toLowerCase().includes(technician));
      });
    } else if (client != ''){
        return this.tasks().filter((task)=>{
          return (task.client.toLowerCase().includes(client));
        });
    } else if (status != ''){
        return this.tasks().filter((task)=>{
          return task.status.toLowerCase() === status.toLowerCase();
        });
    }
    else return this.tasks();
  }

  add(task:Task):Observable<Object>{
    return this.http.post(this.api_url, task).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  edit(task:Task):Observable<Object>{
    return this.http.put(this.api_url + task.id, task).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  assign_tasks_to_technician(
    data:{task_ids:number[], technician_id:number},
    technician:{id:number, full_name:string, image_path:string}
    ):Observable<Object>{
    return this.http.post(this.api_url + 'assign_tasks', data).pipe(
      catchError(this.http_service.handle_error),
      tap(()=>{
        this.tasks().map((task)=>{
          if(data.task_ids.includes(task.id)){
            task.technician_id = technician.id;
            task.technician = technician.full_name;
            task.technician_image = technician.image_path;
            task.status = "In Progress"
          }
        });
      })
    );
  }
  
  public set add_task(task:Task) {
    this.tasks.set([...this.tasks(), task]);
  }

  public set edit_task(task:Task) {
     this.tasks.set(
      this.tasks().map((cl) => {
        if (cl.id === task.id) {
          return task;
        }
        return cl;
      })
    ); 
  }

  public set set_tasks(tasks:Task[]) {
    this.tasks.set(tasks);
  }
}