import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  is_progress_bar_open = signal(false);
  is_open = signal(false);

  message = signal('');

  @Output() confirm = new EventEmitter();

  on_ok_button_click(){
    this.is_progress_bar_open.set(true);

    this.confirm.emit();
  }

  hide_progress_bar(){
    this.is_progress_bar_open.set(false);
  }

  show(){
    this.is_open.set(true);
  }

  hide(){
    this.is_open.set(false);
  }

}
