import { Injectable,inject,signal } from "@angular/core";
import { Task } from "./task.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class TasksService {
    private tasks = signal<Task[]>([]);
    all_tasks = this.tasks.asReadonly();

    private http_task = inject(HttpClient);
    private api_url = 'http://35.180.66.24';

  constructor(){
    // this.all().subscribe({
    //   next:(respond_data)=>{
    //     this.tasks.set(respond_data);
    //   }
    // });

    //this.tasks.set(this.all());
  }

  all():Observable<Task[]>{
    return this.http_task.get<Task[]>('http://35.180.66.24/tasks');
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
    return this.http_task.post(this.api_url + '/tasks', task);
  }

  edit(task:Task):Observable<Object>{
    return this.http_task.put(this.api_url+'/tasks/'+task.id, task);
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