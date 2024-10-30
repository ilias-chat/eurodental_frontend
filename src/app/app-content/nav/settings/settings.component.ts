import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../authentification/auth.service';
import { ToastsService } from '../../../shared/toasts-container/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  private auth_service = inject(AuthService);
  private toasts_service = inject(ToastsService);

  is_closed = signal(true);
  is_loading = signal(false);

  is_progressbar_open = signal(false);

  is_change_password_open = signal(false);
  is_update_profile_open = signal(false);
  is_language_open = signal(false);
  is_theme_open = signal(false);

  //change password variables
  password = signal('');
  new_password = signal('');
  confirm_password = signal('');

  password_error = signal('');
  confirm_password_error = signal('');
  new_password_error = signal('');



  ngOnInit(){
    
  }

  open_dialog(){
    this.is_closed.set(false);
  }

  close_dialog(){
    this.is_closed.set(true);
  }

  on_save_password_click(){

    if(!this.is_new_password_valid() || this.new_password() !== this.confirm_password() || this.password() === ''){

      if(!this.is_new_password_valid()) this.new_password_error.set('e');
      else this.new_password_error.set('');

      if(this.new_password() !== this.confirm_password()) this.confirm_password_error.set('the confirmation does not match the password');
      else this.confirm_password_error.set('');

      if(this.password() === '') this.password_error.set('entre your current password');
      else this.password_error.set('');

      return
    }

    this.is_loading.set(true);

    this.auth_service.change_password(this.password(), this.confirm_password()).subscribe({
      next:(res)=>{
        this.toasts_service.add("Password updated successfully", 'success');
        this.new_password.set('');
        this.confirm_password.set('');
        this.password.set('');
        this.is_loading.set(false);
        this.is_change_password_open.set(false);
      },
      error:(err)=>{
        this.is_loading.set(false);
        if(err.status === 403){
          this.password_error.set('your current password is incorrect');
        }else{
          this.toasts_service.add(err.message, 'danger');
        }
      },
    })
  }

  activate_change_password_option(){
    this.deactivate_all_aptions();
    this.is_change_password_open.set(true);
  }

  activate_update_profile_option(){
    this.deactivate_all_aptions();
    this.is_update_profile_open.set(true);
  }

  activate_language_option(){
    this.deactivate_all_aptions();
    this.is_language_open.set(true);
  }

  activate_theme_option(){
    this.deactivate_all_aptions();
    this.is_theme_open.set(true);
  }

  deactivate_all_aptions(){
    this.is_change_password_open.set(false);
    this.is_update_profile_open.set(false);
    this.is_language_open.set(false);
    this.is_theme_open.set(false);

    //reset cahnge password variables
    this.password.set('');
    this.new_password.set('');
    this.confirm_password.set('');
    this.password_error.set('');
    this.confirm_password_error.set('');
    this.new_password_error.set('');


  }

  is_all_aoptions_deactivated(){
    return !this.is_change_password_open() && !this.is_update_profile_open() && !this.is_language_open() && !this.is_theme_open();
  }

  is_new_password_valid(){
    return this.contains_uppercase(this.new_password()) && this.contains_lowercase(this.new_password()) 
    && this.contains_number(this.new_password()) && this.is_eight_characters_long(this.new_password());
  }

  // Check if the string contains an uppercase character
  contains_uppercase(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  // Check if the string contains a lowercase character
  contains_lowercase(str: string): boolean {
    return /[a-z]/.test(str);
  }

  // Check if the string contains a number
  contains_number(str: string): boolean {
    return /[0-9]/.test(str);
  }

  // Check if the string is at least 8 characters long
  is_eight_characters_long(str: string): boolean {
    return str.length >= 8;
  }
}
