import { Component, ComponentRef, EventEmitter, Input, Output } from '@angular/core';
import { Toast } from '../toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input({required:true}) toast!:Toast;
  @Output() close = new EventEmitter<string>();

  on_close_btn_click(){
    this.close.emit(this.toast.code);
  }
}
