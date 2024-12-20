import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../user.model';
import { AuthService } from '../../../../authentification/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  auth_service = inject(AuthService);
  @Input({required:true}) user!:User;
  @Output() edit = new EventEmitter<User>();

  @Input({required:true}) selected:boolean = false;
  @Output() selected_change = new EventEmitter<void>();

  on_edit_btn_click(){
    this.edit.emit(this.user);
  }

  on_checkbox_change(){
    this.selected_change.emit();
  }
}
