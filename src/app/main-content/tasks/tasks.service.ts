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

    this.tasks.set(this.all());
  }

//   all():Observable<Task[]>{
//     return this.http_task.get<Task[]>('http://35.180.66.24/tasks');
//   }

  all():Task[]{
    return [
        {
          id: 1,
          task_name: "Install New Server",
          task_type: "Installation",
          description: "Set up a new server in the client's office.",
          status: "In Progress",
          technician_id: 101,
          technician: "John Doe",
          technician_image_path: "https://randomuser.me/api/portraits/men/1.jpg",
          client_id: 201,
          client: "Tech Solutions",
          client_image_path: "https://randomuser.me/api/portraits/men/50.jpg",
          task_date: "2024-09-29"
        },
        {
          id: 2,
          task_name: "Network Troubleshooting",
          task_type: "Maintenance",
          description: "Resolve network issues in the client's office.",
          status: "Completed",
          technician_id: 102,
          technician: "Jane Smith",
          technician_image_path: "https://randomuser.me/api/portraits/women/2.jpg",
          client_id: 202,
          client: "Corporate Innovations",
          client_image_path: "https://randomuser.me/api/portraits/men/51.jpg",
          task_date: "2024-09-28"
        },
        {
          id: 3,
          task_name: "Software Upgrade",
          task_type: "Upgrade",
          description: "Upgrade accounting software for the client.",
          status: "Open",
          technician_id: 103,
          technician: "Michael Brown",
          technician_image_path: "https://randomuser.me/api/portraits/men/3.jpg",
          client_id: 203,
          client: "Smart Financial",
          client_image_path: "https://randomuser.me/api/portraits/women/52.jpg",
          task_date: "2024-09-30"
        },
        {
          id: 4,
          task_name: "Replace Router",
          task_type: "Replacement",
          description: "Replace the faulty router at the client's location.",
          status: "In Progress",
          technician_id: 104,
          technician: "Emily Davis",
          technician_image_path: "https://randomuser.me/api/portraits/women/4.jpg",
          client_id: 204,
          client: "Home Office Inc.",
          client_image_path: "https://randomuser.me/api/portraits/men/53.jpg",
          task_date: "2024-09-27"
        },
        {
          id: 5,
          task_name: "Security Audit",
          task_type: "Audit",
          description: "Conduct a security audit of the client's IT infrastructure.",
          status: "Completed",
          technician_id: 105,
          technician: "Chris Johnson",
          technician_image_path: "https://randomuser.me/api/portraits/men/5.jpg",
          client_id: 205,
          client: "SecureNet",
          client_image_path: "https://randomuser.me/api/portraits/women/54.jpg",
          task_date: "2024-09-25"
        }
      ];      
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
}