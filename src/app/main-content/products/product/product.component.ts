import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input({required:true}) product!:Product;
  @Output() edit = new EventEmitter<Product>();

  on_edit_btn_click(){
    this.edit.emit(this.product);
  }
}
