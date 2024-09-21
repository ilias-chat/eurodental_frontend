import { Component, Input } from '@angular/core';
import { My_notification } from '../my_notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input({required: true}) notification!:My_notification;
}
