import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input({required:true}) user!:User;
  @Output() edit = new EventEmitter<User>();

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  ngOnInit(){
    console.log(this.user);
  }

  on_edit_btn_click(){
    this.edit.emit(this.user);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }
}
