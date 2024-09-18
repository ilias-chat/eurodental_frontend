import { Component, inject, signal } from '@angular/core';
import { ToastComponent } from "./toast/toast.component";
import { ToastsService } from './toast.service';
import { Toast } from './toast.model';

@Component({
  selector: 'app-toasts-container',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './toasts-container.component.html',
  styleUrl: './toasts-container.component.css'
})
export class ToastsContainerComponent {
  toasts = signal<Toast[]>([]);

  private ToastsService = inject(ToastsService);

  ngOnInit(){
    this.toasts.set(this.ToastsService.get_all());
  }

  on_toast_close(code:string){
    this.ToastsService.remove(code);
    this.toasts.set(this.ToastsService.get_all());
  }

  add_toast(message:string, type:string){
    this.ToastsService.add(message, type);
    this.toasts.set(this.ToastsService.get_all());
  }
}
