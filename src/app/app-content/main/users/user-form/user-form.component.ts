import { Component, ElementRef, EventEmitter, inject, Output, Signal, signal, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { FormsModule } from '@angular/forms';
import { Profile, ProfilesService } from '../profiles.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  invalid_inputs = signal<string[]>([]);
  
  selected_user:User = this.get_empty_user();

  @ViewChild('dialog') user_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') user_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<{form_data:FormData, user:User}>();

  private profiles_service = inject(ProfilesService);
  profiles: Signal<Profile[]> = this.profiles_service.profiles;

  is_progressbar_open = signal(false);
  error_message = signal('');

  on_close(){
    this.close_dialog();
    this.reset_selected_user();
    this.user_form.nativeElement.reset();
    this.clear_error_massage();
    this.invalid_inputs.set([]);
  }

  open_dialog(){
    this.user_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.user_dialog.nativeElement.close();
  }

  on_save_btn_click(img_input:HTMLInputElement){
    this.error_message.set('');
    this.invalid_inputs.set([]);

    if(!this.selected_user.first_name)
      this.invalid_inputs.set([...this.invalid_inputs(), 'first_name']);
    if(!this.selected_user.last_name)
      this.invalid_inputs.set([...this.invalid_inputs(), 'last_name']);
    if(!this.selected_user.email)
      this.invalid_inputs.set([...this.invalid_inputs(), 'email']);
    if(!this.selected_user.profile_id)
      this.invalid_inputs.set([...this.invalid_inputs(), 'profile_id']);

    if(this.invalid_inputs().length > 0){
      //this.error_message.set('Fill in all the requered inputs');
      return;
    }
    const form_data = new FormData();
    form_data.append('first_name', this.selected_user.first_name);
    form_data.append('last_name', this.selected_user.last_name);
    form_data.append('email', this.selected_user.email);
    form_data.append('phone_number', this.selected_user.phone_number);
    form_data.append('profile_id', this.selected_user.profile_id.toString());
    if(img_input?.files && img_input?.files[0]){
      form_data.append('image', img_input.files[0]);
    }

    this.submit.emit({form_data:form_data, user:this.selected_user});
  }

  reset_selected_user(){
    this.selected_user = this.get_empty_user();
  }

  init_form(user:User){
    this.selected_user = { ...user };
  }

  on_img_input_change(event:Event){
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      this.selected_user.image_path = URL.createObjectURL(input.files[0]);
    }
  }

  on_img_selector_dragover(event:DragEvent){
    event.preventDefault();
  }

  on_img_selector_drop(event:DragEvent, img_input:HTMLInputElement){
    event.preventDefault();

    // Access the dataTransfer object
    const files = event.dataTransfer?.files;

    if (files) {
      img_input.files = files;
      this.selected_user.image_path = URL.createObjectURL(img_input.files[0]);
    }
  }

  show_progressbar(){
    this.is_progressbar_open.set(true);
  }

  hide_progressbar(){
    this.is_progressbar_open.set(false);
  }

  get_empty_user(){
    return {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      city: '',
      image_path: '',
      image_id: '',
      profile: '',
      profile_id: 0,
      address: '',
    }; 
  }

  clear_error_massage(){
    this.error_message.set('');
  }

}
