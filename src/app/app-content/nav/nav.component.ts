import { Component, ViewChild, inject, signal } from '@angular/core';
import { NotificationsComponent } from "../../shared/notifications/notifications.component";
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { AuthService } from '../../authentification/auth.service';
import { map, take } from 'rxjs';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NotificationsComponent, SettingsComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
@ViewChild(NotificationsComponent) notifications_Component!:NotificationsComponent;
@ViewChild(SettingsComponent) settings_Component!:SettingsComponent;
private notifications_service = inject(NotificationsService);
private auth_service = inject(AuthService);
user_name = signal('');
user_profile = signal('');
user_image = signal('');

ngOnInit(){
  this.user_name.set(this.auth_service.user?.first_name + ' ' + this.auth_service.user?.last_name);
  this.user_profile.set(this.auth_service.user?.profile + '');
  this.user_image.set(this.auth_service.user?.image_path + '');
}

  public get notifications_count() : number {
    return this.notifications_service.non_seen_count();
  }

  on_notification_btn_click(){
    this.notifications_Component.open_dialog();
  }
}
