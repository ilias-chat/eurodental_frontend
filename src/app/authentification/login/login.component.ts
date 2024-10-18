import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild('from') from_element!:ElementRef;
  @ViewChild('email_input') email_input!:ElementRef;
  @ViewChild('password_input') password_input!:ElementRef;

  email_error = signal('');
  password_error = signal('');

  is_loading = signal(false);


  reset_email_error(){
    this.email_error.set('')
  }

  reset_password_error(){
    this.password_error.set('')
  }

  on_login_btn_click(){
    if(this.email_input.nativeElement.value === '' || 
      this.password_input.nativeElement.value === '' ||
      !this.is_valid_email(this.email_input.nativeElement.value)){

        if(this.email_input.nativeElement.value === ''){
          this.email_error.set('enter your account email');
        }else if(!this.is_valid_email(this.email_input.nativeElement.value)){
          this.email_error.set('enter a valid email address');
        }else{
          this.email_error.set('');
        }

        if(this.password_input.nativeElement.value === ''){
          this.password_error.set('enter your password');
        }else{
          this.password_error.set('');
        }
      
      return;
    }

    this.is_loading.set(true);
  }

  is_valid_email(email:string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
