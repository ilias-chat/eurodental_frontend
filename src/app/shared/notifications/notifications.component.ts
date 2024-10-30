import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { NotificationComponent } from "./notification/notification.component";
import { My_notification } from './my_notification.model';
import { NotificationsService } from './notifications.service';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NotificationComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  is_closed:boolean = true;
  private notifications_service = inject(NotificationsService);
  
  notifications!:My_notification[];

  ngOnInit(){
    this.notifications = this.notifications_service.all();
    this.notifications_service.non_seen_count.set(this.notifications.filter((n)=>n.seen===false).length);
  }

  open_dialog(){
    this.is_closed = false;
  }

  close_dialog(){
    this.is_closed = true;
  }
}
