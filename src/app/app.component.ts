import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsContainerComponent } from "./shared/toasts-container/toasts-container.component";
import { LoginComponent } from './authentification/login/login.component';
import { AuthentificationService } from './authentification/authentification.service';
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

  authentification_service = inject(AuthentificationService);
  
  ngOnInit(){
    this.authentification_service.auto_login();
  }

}
