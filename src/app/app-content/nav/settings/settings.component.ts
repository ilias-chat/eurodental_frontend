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

  toggle_change_password_option(){
    this.is_change_password_open.set(!this.is_change_password_open());
  }

  toggle_update_profile_option(){
    this.is_update_profile_open.set(!this.is_update_profile_open());
  }

  toggle_language_option(){
    this.is_language_open.set(!this.is_language_open());
  }

  toggle_theme_option(){
    this.is_theme_open.set(!this.is_theme_open());
  }
}
