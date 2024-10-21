import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent {

  is_progresbar_open = signal<boolean>(false);

  quantity:number|null = null

  @Input({required:true}) product_refs = signal<string[]>([]);

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<number>();

  on_save_btn_click(){

    if(!this.quantity){
      return;
    }

    this.show_progresbar();

    this.save.emit(this.quantity);
  }

  on_close_btn_click(){
    this.quantity = 0;
    this.close.emit();
  }

  show_progresbar(){
    this.is_progresbar_open.set(true);
  }

  hide_progresbar(){
    this.is_progresbar_open.set(false);
  }

}
