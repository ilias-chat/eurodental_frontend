import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastsService } from '../../shared/toasts-container/toast.service';
import { FormsModule } from '@angular/forms';

enum ui_type {
  login,
  set_password,
  forgot_password,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private auth_service = inject(AuthService);
  private toasts_service = inject(ToastsService);
  private router = inject(Router);

  @ViewChild('from') from_element!:ElementRef;

  message = signal('');

  email_error = signal('');
  password_error = signal('');
  new_password_error = signal('');
  confirm_password_error = signal('');

  is_loading = signal(false);
  switch = signal(false);

  public ui_type = ui_type;
  view = signal(ui_type.login);

  email = signal('');
  password = signal('');
  new_password = signal('');
  confirm_password = signal('');

  reset_email_error(){
    this.email_error.set('')
  }

  reset_password_error(){
    this.password_error.set('')
  }

  on_login_btn_click(){

    this.message.set('');

    if(this.email() === '' || 
      this.password() === '' ||
      !this.is_valid_email(this.email())){

        if(this.email() === ''){
          this.email_error.set('enter your account email');
        }else if(!this.is_valid_email(this.email())){
          this.email_error.set('enter a valid email address');
        }else{
          this.email_error.set('');
        }

        if(this.password() === ''){
          this.password_error.set('enter your password');
        }else{
          this.password_error.set('');
        }
      
      return;
    }

    this.is_loading.set(true);

    this.auth_service.login(this.email(), this.password()).subscribe({
      next:(response_data)=> {
        this.is_loading.set(false);
        if((response_data as {requires_password_change:boolean}).requires_password_change){
          this.switch_to(ui_type.set_password);
        }else{
          this.router.navigate(['/app/dashboard']);
        }
      },
      error:(response_err)=> {
        if(response_err.status === 403){
          this.toasts_service.add("invalid email or password", 'danger');
        }else{
          this.toasts_service.add(response_err.message, 'danger');
        }
        this.is_loading.set(false);
      },
  });
  }

  on_save_password_click(){

    this.message.set('');

    if(!this.is_new_password_valid() || this.new_password() !== this.confirm_password()){
      if(!this.is_new_password_valid()) this.new_password_error.set('e');
      else this.new_password_error.set('');
      if(this.new_password() !== this.confirm_password()) this.confirm_password_error.set('the password and confirmation do not match');
      else this.confirm_password_error.set('');
      return
    }

    this.is_loading.set(true);

    this.auth_service.change_password(this.password(), this.confirm_password()).subscribe({
      next:(res)=>{
        this.toasts_service.add("Password created successfully", 'success');
        this.message.set('Log in with your new password');
        this.new_password.set('');
        this.confirm_password.set('');
        this.password.set('');
        this.is_loading.set(false);
        this.switch_to(ui_type.login);
      },
      error:(err)=>{
        this.is_loading.set(false);
        this.toasts_service.add(err.message, 'danger');
      },
    })
  }

  on_reset_password_click(){

    this.message.set('');

    if(this.email() === ''){
      this.email_error.set('enter your account email');
      return;
    }else if(!this.is_valid_email(this.email())){
      this.email_error.set('enter a valid email address');
      return;
    }else{
      this.email_error.set('');
    }

    this.is_loading.set(true);

    this.auth_service.reset_password(this.email()).subscribe({
      next:(res)=>{
        this.toasts_service.add("Password reset successfully", 'success');
        this.view.set(ui_type.login);
        this.password.set('');
        this.is_loading.set(false);
        this.message.set('A verification code has been sent to your email. Please check your inbox and enter the code to proceed.');
      },
      error:(err)=>{
        this.is_loading.set(false);
        this.toasts_service.add(err.message, 'danger');
      },
    })

  }

  switch_to(view_type: ui_type){
    this.view.set(view_type);
    //show animation
    this.switch.set(true);
    setTimeout(() => {
      this.switch.set(false);
    }, 500);
  }

  is_valid_email(email:string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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
