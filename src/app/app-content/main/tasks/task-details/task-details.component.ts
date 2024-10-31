import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { Task_details, TasksService } from '../tasks.service';
import { ToastsService } from '../../../../shared/toasts-container/toast.service';
import { AuthService } from '../../../../authentification/auth.service';
import { ProductsComboboxComponent } from "../../../../shared/products-combobox/products-combobox.component";
import { TaskProductService } from '../taskproducts.service';
import { FormsModule } from '@angular/forms';

interface AddResponseData{
  price: number,
  quantity: number,
  product_reference: string,
  id: number,
  task_id: number,
  purchase_date: string,
}

interface TaskProductUpdate{
  price:number,
  quantity: number,
  id: number,
  product_reference:string,
}

interface TaskProduct{
  price:number,
  has_warranty:boolean,
  warranty_duration_months:number,
  id: number,
  product_name:string,
}

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [ProductsComboboxComponent, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  //task_id:number = 0;
  @ViewChild(ProductsComboboxComponent) product_combo!:ProductsComboboxComponent;

  is_add_product_form_open  = signal(false);
  is_update_product_form_open  = signal(false);
  selected_product_id = signal(0);

  auth_service = inject(AuthService);
  private toasts_service = inject(ToastsService);
  private tasks_service = inject(TasksService);
  private task_product_service = inject(TaskProductService);

  task_details = signal<Task_details>(this.get_empty_task());

  is_open = signal(false);
  is_loading = signal(false);

  on_close_btn_click(){
    this.is_open.set(false);
    this.init_task(0);
    this.is_update_product_form_open.set(false);
    this.is_add_product_form_open.set(false);
    this.selected_product_id.set(0);
  }

  open_task_details(task_id:number){
    this.is_open.set(true);
    this.init_task(task_id);
  }

  init_task(task_id:number = 0){
    if (task_id == 0){
      this.task_details.set(this.get_empty_task()) 
    }else{
      this.is_loading.set(true);
        this.tasks_service.get_by_id(task_id).subscribe({
          next:(res_data)=>{
            this.is_loading.set(false);
            this.task_details.set(res_data);
          },
          error:(res_err)=>{
            this.is_loading.set(false);
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

  on_add_product(){
    this.is_add_product_form_open.set(true);
  }

  on_update_product(product_id:number){
    this.is_update_product_form_open.set(true);
    this.selected_product_id.set(product_id);
  }

  on_close_update_form(){
    this.is_update_product_form_open.set(false);
    this.selected_product_id.set(0);
  }

  on_save_new_product(){

    if(this.product_combo.selected_product().id = 0) return;

    this.is_loading.set(true);
    
    this.task_product_service.add({
      id:0,
      product_reference:this.product_combo.selected_product().reference,
      price:Number(this.product_combo.selected_product().price),
      quantity:1,
      task_id:this.task_details().id,
    }).subscribe({
      next:(res)=>{
        this.task_details().products.push({
          id:(res as AddResponseData).id,
          product_reference:(res as AddResponseData).product_reference,
          name:this.product_combo.selected_product().product_name,
          price:(res as AddResponseData).price,
          quantity:1,
          purshase_date:(res as AddResponseData).purchase_date,
          product_details:(this.product_combo.selected_product() as TaskProduct),
        });
        this.is_add_product_form_open.set(false);
        this.toasts_service.add('product has been added to the task successfully', 'success');
        this.is_loading.set(false);
      },
      error:(err)=>{
        this.toasts_service.add(err.message, 'danger');
        this.is_loading.set(false);
      },
    })
  }

  on_save_update_product(product:TaskProductUpdate){

    this.is_loading.set(true);
    
    this.task_product_service.edit({
      id:product.id,
      product_reference:product.product_reference,
      price:Number(product.price),
      quantity:product.quantity,
      task_id:this.task_details().id,
    }, product.id).subscribe({
      next:(res)=>{
        this.is_update_product_form_open.set(false);
        this.toasts_service.add('changes have been saved successfully', 'success');
        this.is_loading.set(false);
      },
      error:(err)=>{
        this.toasts_service.add(err.message, 'danger');
        this.is_loading.set(false);
      },
    })
  }

}
