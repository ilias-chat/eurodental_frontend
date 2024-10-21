import { Component, ElementRef, inject, Signal, signal, ViewChild } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UserComponent } from './user/user.component';
import { Profile, ProfilesService } from './profiles.service';
import { ToastsService } from '../../../shared/toasts-container/toast.service';
import { SkeletonRowListComponent } from '../../../shared/skeletons/skeleton-row-list/skeleton-row-list.component';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserFormComponent, SkeletonRowListComponent, UserComponent, ConfirmComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private toasts_service = inject(ToastsService);
  private users_service = inject(UsersService);
  private profiles_service = inject(ProfilesService);

  @ViewChild(UserFormComponent) user_form_component!:UserFormComponent;
  @ViewChild(ConfirmComponent) confirm_component!:ConfirmComponent;
  all_users = signal<User[]>([]);
  selected_users_ids = signal<number[]>([]);
  profiles: Signal<Profile[]> = this.profiles_service.profiles;

  current_page = signal<number>(1);
  lines_per_page:number = 10;
  total_pages = signal<number>(1);
  total_users = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_profile') combo_profile!: ElementRef;

  is_loading = signal(false);
  is_error = signal(false);

  ngOnInit(){

    this.refresh_users();
    this.reset_pagination();
  }

  refresh_users(){
    
    this.is_loading.set(true);
    this.is_error.set(false);

    this.users_service.all().subscribe({
      next:(respond_data)=>{
        this.all_users.set(respond_data);
        this.users_service.set_users = respond_data;
        this.total_users.set(respond_data.length);
        this.filter_users();
        this.is_loading.set(false);
      },
      error:(err)=>{
        console.error(err);
        this.is_loading.set(false);
        this.is_error.set(true);
      },
    })
  } 

  get users(): User[] {
    return this.all_users().slice(this.start_index(), this.end_index());
  }

  on_next_btn_clicked(){
    if(this.current_page()==this.total_pages()) return;
    this.current_page.set(this.current_page()+1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  on_previous_btn_clicked(){
    if(this.current_page()==1) return;
    this.current_page.set(this.current_page()-1);
    this.start_index.set(this.lines_per_page*(this.current_page()-1));
    this.end_index.set(this.start_index() + this.lines_per_page);
  }

  open_form_dialog(){
    this.user_form_component.open_dialog();
  }

  on_add_user(){
    this.open_form_dialog()
  }

  on_search_input_keyup(){
    this.filter_users();
  }

  on_combo_profile_change(){
    this.filter_users();
  }

  filter_users(){
    const search_input_value = this.search_input.nativeElement.value;
    const profile_combo_value = this.combo_profile.nativeElement.value;
    this.all_users.set(this.users_service.filter(search_input_value,profile_combo_value));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_pagination();
  }

  reset_pagination(){
    this.total_users.set(this.all_users().length);
    if(this.total_users() % this.lines_per_page == 0)
      this.total_pages.set(this.total_users()/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(this.total_users()/this.lines_per_page)+1);

    if (this.total_pages() === 0) this.total_pages.set(1);
  }

  on_reset_filter_click(){
    this.reset_filter();
    this.reset_pagination();
  }

  reset_filter(){
    this.search_input.nativeElement.value = '';
    this.combo_profile.nativeElement.value = '';
    this.all_users.set(this.users_service.filter('',''));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
  }

  on_form_submit(user_form_data:{form_data:FormData, user:User}){

    this.user_form_component.show_progressbar();

    if(user_form_data.user.id === 0){
      this.users_service.add(user_form_data.form_data)
      .subscribe({
        next:(respond_data)=>{
          this.toasts_service.add("user have been created successfully", "success");
          user_form_data.user.id = (respond_data as User).id;
          this.users_service.add_user = user_form_data.user;
          this.filter_users();
          this.reset_and_close_form();
          this.user_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.user_form_component.hide_progressbar();
          this.user_form_component.error_message.set(err.message);
          console.log(err);
        },
      });     
    } else {
      this.users_service.edit(user_form_data.form_data, user_form_data.user.id).subscribe({
        next:(res)=>{
          this.toasts_service.add('Changes have been saved successfully','success');
          this.users_service.edit_user = user_form_data.user;
          this.filter_users();
          this.reset_and_close_form();
          this.user_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.user_form_component.hide_progressbar();
          this.user_form_component.error_message.set(err.message);
          console.log('edid error:',err);
        },
      });
    }
  }

  on_user_edit(user:User){
    this.user_form_component.init_form(user);
    this.user_form_component.open_dialog();
  }

  on_user_selected_change(param_id:number){

    if (this.selected_users_ids().includes(param_id)) {
      this.selected_users_ids.set(
        this.selected_users_ids().filter(id => id !== param_id)
      );
    }else{
      this.selected_users_ids.set([...this.selected_users_ids(), param_id]);
    }
  }

  on_list_options_close_btn_click(){
    this.selected_users_ids.set([]);
  }

  reset_and_close_form(){
    this.user_form_component.on_close();
    this.user_form_component.reset_selected_user();
  }

  confirm_blocking_users(){
    this.confirm_component.message.set('Are you sure you want to block this users? Once blocked, they will not be able to connect to the app.');
    this.confirm_component.show();
  }

  block_users(){

    this.users_service.block_users({user_ids:this.selected_users_ids()}).subscribe({
      next:(res)=>{
        this.toasts_service.add('Changes have been saved successfully', 'success');
        this.selected_users_ids.set([]);
        this.confirm_component.hide();
      },
      error:(err)=>{
        this.confirm_component.hide_progress_bar();
        this.toasts_service.add(err.message, 'danger');
      },
    });
  }
}
