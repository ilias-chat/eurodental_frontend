import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { MainContentComponent } from "./main-content/main-content.component";
import { NavComponent } from "./nav/nav.component";
import { ToastsContainerComponent } from "./shared/toasts-container/toasts-container.component";
import { NotificationsComponent } from "./shared/notifications/notifications.component";
import { LoginComponent } from './authentification/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideMenuComponent, MainContentComponent, NavComponent, ToastsContainerComponent, NotificationsComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eurodental_frontend';
}
