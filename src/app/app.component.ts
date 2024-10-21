import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsContainerComponent } from "./shared/toasts-container/toasts-container.component";
import { LoginComponent } from './authentification/login/login.component';
import { AuthService } from './authentification/auth.service';
import { AppContentComponent } from "./app-content/app-content.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastsContainerComponent, LoginComponent, AppContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eurodental_frontend';

  auth_service = inject(AuthService);
  
  ngOnInit(){
    this.auth_service.auto_login();
  }

}
