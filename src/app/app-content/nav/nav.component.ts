import { Component, ViewChild, inject, signal } from '@angular/core';
import { NotificationsComponent } from "../../shared/notifications/notifications.component";
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { AuthService } from '../../authentification/auth.service';
import { map, take } from 'rxjs';

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
private auth_service = inject(AuthService);
user_name = signal('');
user_profile = signal('');

  ngOnInit(){
    this.auth_service.user.pipe(
      take(1),
      map(user=>{
        this.user_name.set(user?.first_name + ' ' + user?.last_name);
        this.user_profile.set(user?.profile + '');
      })
    ).subscribe();
  }

  public get notifications_count() : number {
    return this.notifications_service.non_seen_count();
  }

  on_notification_btn_click(){
    this.notifications_Component.open_dialog();
  }
}
