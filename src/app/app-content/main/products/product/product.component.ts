import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../product.model';
import { AuthService } from '../../../../authentification/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  auth_service = inject(AuthService);
  @Input({required:true}) product!:Product;
  @Output() edit = new EventEmitter<Product>();

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  on_edit_btn_click(){
    this.edit.emit(this.product);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }
}
