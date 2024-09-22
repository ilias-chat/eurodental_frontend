import { Component, ViewChild, inject, signal } from '@angular/core';
import { NotificationsComponent } from "../shared/notifications/notifications.component";
import { NotificationsService } from '../shared/notifications/notifications.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
@ViewChild(NotificationsComponent) notifications_Component!:NotificationsComponent;
private notifications_service = inject(NotificationsService);

  public get notifications_count() : number {
    return this.notifications_service.non_seen_count();
  }

  on_notification_btn_click(){
    this.notifications_Component.open_dialog();
  }
}
