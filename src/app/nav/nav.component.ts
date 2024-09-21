import { Component, ViewChild } from '@angular/core';
import { NotificationsComponent } from "../shared/notifications/notifications.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
@ViewChild(NotificationsComponent) notifications_Component!:NotificationsComponent;
  on_notification_btn_click(){
    this.notifications_Component.open_dialog()
  }
}
