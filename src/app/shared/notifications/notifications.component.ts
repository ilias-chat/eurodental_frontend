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
    console.log(this.notifications);
  }

  open_dialog(){
    this.is_closed = false;

    console.log('open');
  }

  close_dialog(){
    this.is_closed = true;
  }
}
