import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  is_closed = signal(true);

  is_progressbar_open = signal(false);

  is_change_password_open = signal(false);
  is_update_profile_open = signal(false);
  is_language_open = signal(false);
  is_theme_open = signal(false);

  ngOnInit(){
    
  }

  open_dialog(){
    this.is_closed.set(false);
  }

  close_dialog(){
    this.is_closed.set(true);
  }

  activate_change_password_option(){
    this.deactivate_all_aptions();
    this.is_change_password_open.set(true);
  }

  activate_update_profile_option(){
    this.deactivate_all_aptions();
    this.is_update_profile_open.set(true);
  }

  activate_language_option(){
    this.deactivate_all_aptions();
    this.is_language_open.set(true);
  }

  activate_theme_option(){
    this.deactivate_all_aptions();
    this.is_theme_open.set(true);
  }

  deactivate_all_aptions(){
    this.is_change_password_open.set(false);
    this.is_update_profile_open.set(false);
    this.is_language_open.set(false);
    this.is_theme_open.set(false);
  }

  is_all_aoptions_deactivated(){
    return !this.is_change_password_open() && !this.is_update_profile_open() && !this.is_language_open() && !this.is_theme_open();
  }
}
