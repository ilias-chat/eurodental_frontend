import { Component, inject, Signal, signal } from '@angular/core';
import { Profile, ProfilesService } from '../profiles.service';
import { FormsModule } from '@angular/forms';
import { ToastsService } from '../../../../shared/toasts-container/toast.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {

  is_open = signal(false);
  is_progressbar_open = signal(false);
  error_message = signal('');

  private toasts_service = inject(ToastsService);
  private profiles_service = inject(ProfilesService);
  profiles: Signal<Profile[]> = this.profiles_service.profiles;

  select_profile_id = signal(0);
  is_update_form_open = signal(false);

  old_profile:Profile|null = null;

  close(){
    this.is_open.set(false);
  }

  open(){
    this.is_open.set(true);
  }

  clear_error_message(){
    this.error_message.set('');
  }

  on_edit_btn_click(profile:Profile){
    this.old_profile = {...profile}
    this.select_profile_id.set(profile.id);
    this.is_update_form_open.set(true);
  }

  close_update_form(){
    this.select_profile_id.set(0);
    this.is_update_form_open.set(false);
    if(this.old_profile){
      this.profiles_service.edit_profile = this.old_profile;
      this.old_profile = null;
    }
  }

  on_save_profile_btn_click(profile:Profile){
    this.is_progressbar_open.set(true);
    this.profiles_service.edit_right(profile).subscribe({
      next:(res_data)=>{
        this.is_progressbar_open.set(false);
        this.select_profile_id.set(0);
        this.is_update_form_open.set(false);
        this.toasts_service.add('Changes have been saved successfully','success');
      },
      error:(res_error)=>{
        this.is_progressbar_open.set(false);
        this.error_message.set(res_error.error.details);
      },
    })
  }

  on_new_profile_btn_click(){

  }

}
