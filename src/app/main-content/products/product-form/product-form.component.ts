import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Product } from '../product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  selected_product:Product = {
    id: 0,
    product_name: '',
    image_path:'',
    brand:'',
    id_categorie:0,
    categorie:'',
    id_sub_categorie:0,
    sub_categorie:'',
    price:0,
    stock_quantity:0,
    has_warranty:false ,
    warranty_duration_months:0,
    purshase_date:'00-00-0000',
    description:'',
  };
  @ViewChild('dialog') product_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') product_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<Product>();

  on_close(){
    this.close_dialog();
    this.reset_selected_product();
    this.product_form.nativeElement.reset();
  }

  open_dialog(){
    this.product_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.product_dialog.nativeElement.close();
  }

  on_save_btn_click(){
    this.submit.emit({ ...this.selected_product});
    this.on_close();
    this.reset_selected_product();
  }

  reset_selected_product(){
    this.selected_product = {
      id: 0,
      product_name: '',
      image_path:'',
      brand:'',
      id_categorie:0,
      categorie:'',
      id_sub_categorie:0,
      sub_categorie:'',
      price:0,
      stock_quantity:0,
      has_warranty:false ,
      warranty_duration_months:0,
      purshase_date:'00-00-0000',
      description:'',
    };
  }

  init_form(product:Product){
    this.selected_product = { ...product };
  }

  on_img_input_change(event:Event){
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      this.selected_product.image_path = URL.createObjectURL(input.files[0]);
    }
  }

  on_img_selector_dragover(event:DragEvent){
    event.preventDefault();
  }

  on_img_selector_drop(event:DragEvent, img_input:HTMLInputElement){
    event.preventDefault();

    // Access the dataTransfer object
    const files = event.dataTransfer?.files;

    if (files) {
      img_input.files = files;
      this.selected_product.image_path = URL.createObjectURL(img_input.files[0]);
    }
  }
}