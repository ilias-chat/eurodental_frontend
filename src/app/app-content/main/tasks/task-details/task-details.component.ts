import { Component, Input, signal } from '@angular/core';

interface Task_product{
  id:number,
  reference:string,
  name:string,
  price:number,
  quantity:number,
  purshase_date:string,
}

interface Task_details{
  id:number,
  task_name:string,
  task_type:string,
  description:string,
  status:string,
  technician_id:number,
  technician:string,
  technician_image_path:string,
  technician_phone_number:string,
  technician_email:string,
  technician_address:string,
  client_id:number,
  client:string,
  client_image_path:string,
  client_phone_number:string,
  client_email:string,
  client_city:string,
  client_address:string,
  task_date:string,
  products:Task_product[],
}

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  @Input({required:true}) task_id:number = 0;
  task_details = signal<Task_details|undefined>(undefined);

  is_open = signal(false);

  on_close_btn_click(){
    this.is_open.set(false);
  }

  open_task_details(task_id:number){
    this.is_open.set(true);
    this.init_task(task_id);
  }

  init_task(task_id:number){

  }

  ngOnInit(){
    this.task_details.set({
      id:1,
      task_name:'Install new server',
      task_type:'instalation',
      description:'Install new server description',
      status:'Open',
      technician_id:101,
      technician:'technician name',
      technician_image_path:'https://www.w3schools.com/howto/img_avatar.png',
      technician_phone_number:'0655889944',
      technician_email:'example@email.com',
      technician_address:'exampleof a client address',
      client_id:893,
      client:'client name',
      client_image_path:'https://www.w3schools.com/howto/img_avatar.png',
      client_phone_number:'0606060606',
      client_email:'test@email.com',
      client_city:'tanger',
      client_address:'exampleof a client address',
      task_date:'2024-10-01',
      products:[
        {
          id:1,
          reference:'01ref01',
          name:'product name 1',
          price:89.99,
          quantity:1,
          purshase_date:'2024-10-01',
        },
        {
          id:2,
          reference:'01ref01',
          name:'product name 1',
          price:399.99,
          quantity:2,
          purshase_date:'2024-10-01',
        },
        {
          id:3,
          reference:'03ref03',
          name:'product name 3',
          price:549.00,
          quantity:5,
          purshase_date:'2024-10-01',
        }
      ],
    })
  }

}
