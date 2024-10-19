import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthentificationService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authentification_service = inject(AuthentificationService);
  private router = inject(Router);

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

    const email = this.email_input.nativeElement.value;
    const password = this.password_input.nativeElement.value;
    if(email === '' || 
      password === '' ||
      !this.is_valid_email(email)){

        if(email === ''){
          this.email_error.set('enter your account email');
        }else if(!this.is_valid_email(email)){
          this.email_error.set('enter a valid email address');
        }else{
          this.email_error.set('');
        }

        if(password === ''){
          this.password_error.set('enter your password');
        }else{
          this.password_error.set('');
        }
      
      return;
    }

    this.is_loading.set(true);

    this.authentification_service.login(email, password).subscribe({
      next:(response_data)=> {
        this.router.navigate(['/app/dashboard']);
        this.is_loading.set(false);
      },
      error:(response_err)=> {
        console.error(response_err);
        this.is_loading.set(false);
      },
  });
  }

  is_valid_email(email:string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
