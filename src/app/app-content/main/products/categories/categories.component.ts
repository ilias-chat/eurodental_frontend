import { HttpClient } from '@angular/common/http';
import { Component, Signal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../categories.service';
import { SubCategoriesService, Sub_category } from '../sub_categories.service';
import { ToastsService } from '../../../../shared/toasts-container/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  is_open = signal<boolean>(false);

  private Toasts_service = inject(ToastsService);
  private categoris_service = inject(CategoriesService);
  private sub_categoris_service = inject(SubCategoriesService);

  categories: Signal<Category[]> = this.categoris_service.categories;
  sub_categories: Signal<Sub_category[]> = this.sub_categoris_service.sub_categories;

  selected_category = signal<Category>({id:0, category:''});
  selected_subcategory = signal<Sub_category>({id:0, category_id:0, sub_category:''});

  is_category_form_open = signal<boolean>(false);
  is_sub_category_form_open = signal<boolean>(false);

  is_category_input_valid = signal(true);
  is_sub_category_input_valid = signal(true);

  is_progresbar_open = signal<boolean>(false);

  on_close(){
    this.close_dialog();
  }

  open_dialog(){
    this.is_open.set(true);
  }

  close_dialog(){
    this.is_open.set(false);
    this.is_category_form_open.set(false);
    this.selected_category.set({id:0, category:''});
    this.is_sub_category_form_open.set(false);
    this.is_category_input_valid.set(true);
    this.is_sub_category_input_valid.set(true);
    this.selected_subcategory.set({id:0, category_id:0, sub_category:''});
  }

  on_new_category_btn_click(){
    this.is_category_form_open.set(true);
    this.selected_category.set({id:0, category:''});
    //this.subcategories_by_cat.set([]);
  }

  on_new_sub_category_btn_click(){
    this.is_sub_category_form_open.set(true);
    this.selected_subcategory.set({id:0, category_id:0, sub_category:''});
  }

  close_category_form(){
    this.is_category_form_open.set(false);
    this.is_category_input_valid.set(true);
  }

  close_sub_category_form(){
    this.is_sub_category_form_open.set(false);
    this.is_sub_category_input_valid.set(true);
    this.selected_subcategory.set({id:0, sub_category:'', category_id:0});
  }

  on_close_category_form_btn_click(){
    this.close_category_form();
  }

  on_close_subcategory_form_btn_click(){
    this.close_sub_category_form();
  }

  on_edit_category_btn_click(category:Category){
    this.selected_category.set({...category});
    this.is_category_form_open.set(true);
  }

  on_edit_sub_category_btn_click(sub_category:Sub_category){
    this.selected_subcategory.set({...sub_category});
    this.is_sub_category_form_open.set(true);
  }

  on_save_category_btn_click(){

    if(!this.selected_category().category){
      this.is_category_input_valid.set(false);
      return
    }else{
      this.is_category_input_valid.set(true);
    }

    this.is_progresbar_open.set(true);

    if (this.selected_category().id === 0) {
      this.categoris_service.add(this.selected_category()).subscribe({
        next:(respond_data)=>{
          this.selected_category().id = (respond_data as Category).id;
          this.categoris_service.add_category = this.selected_category();
          this.close_category_form();
          this.Toasts_service.add('category has been created successfully', 'success');
          this.is_progresbar_open.set(false);
        },
        error:(err)=>{
          console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
          this.is_progresbar_open.set(false);
        },
      });
    }else{
      this.categoris_service.edit(this.selected_category()).subscribe({
        next:(respond_data)=>{
          this.categoris_service.edit_category = this.selected_category();
          this.close_category_form();
          this.Toasts_service.add('changes have been saved successfully', 'success');
          this.is_progresbar_open.set(false);
        },
        error:(err)=>{
          console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
          this.is_progresbar_open.set(false);
        },
      });
    }
  }

  on_save_sub_category_btn_click(){

    if(!this.selected_subcategory().sub_category){
      this.is_sub_category_input_valid.set(false);
      return
    }else{
      this.is_sub_category_input_valid.set(true);
    }

    this.is_progresbar_open.set(true);

    if (this.selected_subcategory().id === 0) {
      //console.log(this.selected_subcategory());
      this.selected_subcategory().category_id = this.selected_category().id;
      this.sub_categoris_service.add(this.selected_subcategory()).subscribe({
        next:(respond_data)=>{
          this.selected_subcategory().id = (respond_data as Sub_category).id;
          this.selected_subcategory().category_id = (respond_data as Sub_category).category_id;
          this.sub_categoris_service.add_sub_category = this.selected_subcategory();
          this.close_sub_category_form();
          this.Toasts_service.add('sub-category has been created successfully', 'success');
          this.is_progresbar_open.set(false);
        },
        error:(err)=>{
          //console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
          this.is_progresbar_open.set(false);
        },
      });
    }else{
      this.sub_categoris_service.edit(this.selected_subcategory()).subscribe({
        next:(respond_data)=>{
          this.sub_categoris_service.edit_sub_category = this.selected_subcategory()
          this.close_sub_category_form();
          this.Toasts_service.add('changes have been saved successfully', 'success');
          this.is_progresbar_open.set(false);
        },
        error:(err)=>{
          //console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
          this.is_progresbar_open.set(false);
        },
      });
    }
  }

  on_category_click(cat:Category){
    this.selected_category.set({...cat});
    this.is_category_form_open.set(false);
  }
  
  public get sub_categories_by_category() : Sub_category[] {
    return this.sub_categories().filter((cat)=>{
      return cat.category_id === this.selected_category().id;
    })
  }
  
}
