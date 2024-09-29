import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastsService } from '../../../shared/toasts-container/toast.service';

interface Category{
  id:number,
  category:string,
}

interface Sub_category{
  id:number,
  category_id:number,
  sub_category:string,
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  is_open = signal<boolean>(false);

  private http_client = inject(HttpClient);
  private api_url = 'http://35.180.66.24';

  private Toasts_service = inject(ToastsService);

  categories = signal<Category[]>([]);
  sub_categories = signal<Sub_category[]>([]);
  subcategories_by_cat = signal<Sub_category[]>([]);

  selected_category:Category = {id:0, category:''};
  selected_subcategory:Sub_category = {id:0, category_id:0, sub_category:''};

  is_category_form_open = signal<boolean>(false);
  is_sub_category_form_open = signal<boolean>(false);

  progresbar_value = signal<number>(5);
  is_progresbar_open = signal<boolean>(false);

  ngOnInit(){
    this.http_client.get<Category[]>(this.api_url+'/categories').subscribe({
      next:(respond_data)=>{
        this.categories.set((respond_data));
      },
      error:(err)=>{
        console.error(err.message);
      },
    });

    this.http_client.get<Sub_category[]>(this.api_url+'/sub_categories').subscribe({
      next:(respond_data)=>{
        this.sub_categories.set((respond_data));
      },
      error:(err)=>{
        console.error(err.message);
      },
    });
  }

  on_close(){
    this.close_dialog();
    this.subcategories_by_cat.set([]);
  }

  open_dialog(){
    this.is_open.set(true);
  }

  close_dialog(){
    this.is_open.set(false);
    this.is_category_form_open.set(false);
    this.selected_category = {id:0, category:''};
    this.is_sub_category_form_open.set(false);
    this.selected_subcategory = {id:0, category_id:0, sub_category:''};
  }

  on_new_category_btn_click(){
    this.is_category_form_open.set(true);
    this.selected_category = {id:0, category:''};
    this.subcategories_by_cat.set([]);
  }

  on_new_sub_category_btn_click(){
    this.is_sub_category_form_open.set(true);
    this.selected_subcategory = {id:0, category_id:0, sub_category:''};
  }

  close_category_form(){
    this.is_category_form_open.set(false);
    this.selected_category = {id:0, category:''};
  }

  close_sub_category_form(){
    this.is_sub_category_form_open.set(false);
    this.selected_subcategory = {id:0, sub_category:'', category_id:0};
  }

  on_close_category_form_btn_click(){
    this.close_category_form();
  }

  on_close_subcategory_form_btn_click(){
    this.close_sub_category_form();
  }

  on_edit_category_btn_click(category:Category){
    this.selected_category = {...category};
    this.is_category_form_open.set(true);
  }

  on_edit_sub_category_btn_click(sub_category:Sub_category){
    this.selected_subcategory = {...sub_category};
    this.is_sub_category_form_open.set(true);
  }

  on_save_category_btn_click(){
    this.is_progresbar_open.set(true);

    if (this.selected_category.id === 0) {
      this.http_client.post(this.api_url+'/categories',{category:this.selected_category.category}).subscribe({
        next:(respond_data)=>{
          this.selected_category.id = (respond_data as Category).id;
          this.categories.set([...this.categories(), this.selected_category])
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
      this.http_client.put(this.api_url+'/categories/'+this.selected_category.id, {category:this.selected_category.category}).subscribe({
        next:(respond_data)=>{
          this.categories.set(this.categories().map((cat)=>{
              if (cat.id === this.selected_category.id) {
                return this.selected_category;
              }else{
                return cat;
              }
            })
          );
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

    this.is_progresbar_open.set(true);
    const interval = setInterval(()=>{
      this.progresbar_value.set(this.progresbar_value()+1);
    },25);
    setTimeout(() => {
      clearInterval(interval); // Stop the interval
    }, 2000);

    if (this.selected_subcategory.id === 0) {
      this.http_client.post(
        this.api_url+'/sub_categories',
        {sub_category:this.selected_subcategory.sub_category, category_id:this.selected_category.id}
        ).subscribe({
        next:(respond_data)=>{
          this.selected_subcategory.id = (respond_data as Sub_category).id;
          this.selected_subcategory.category_id = (respond_data as Sub_category).category_id;
          this.sub_categories.set([...this.sub_categories(), this.selected_subcategory]);
          this.subcategories_by_cat.set([...this.subcategories_by_cat(), this.selected_subcategory]);
          this.close_sub_category_form();
          this.Toasts_service.add('sub-category has been created successfully', 'success');
          this.reset_progresbar(interval as unknown as number);
        },
        error:(err)=>{
          console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
        },
      });
    }else{
      this.http_client.put(
        this.api_url+'/sub_categories/'+this.selected_subcategory.id, 
        {sub_category:this.selected_subcategory.sub_category}
        ).subscribe({
        next:(respond_data)=>{
          this.sub_categories.set(this.sub_categories().map((cat)=>{
              if (cat.id === this.selected_subcategory.id) {
                return this.selected_subcategory;
              }else{
                return cat;
              }
            })
          );
          this.close_sub_category_form();
          this.filter_subcategories_by_cat();
          this.Toasts_service.add('changes have been saved successfully', 'success');
          this.reset_progresbar(interval as unknown as number);
        },
        error:(err)=>{
          console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
        },
      });
    }
  }

  on_category_click(cat:Category){
    this.selected_category = {...cat}
    this.is_category_form_open.set(false);
    this.filter_subcategories_by_cat();
  }

  filter_subcategories_by_cat(){
    this.subcategories_by_cat.set(this.sub_categories().filter((sub_cat)=>{
      return sub_cat.category_id === this.selected_category.id
    }))
  }

  reset_progresbar(interval_id:number){
    this.progresbar_value.set(100);
    this.is_progresbar_open.set(false);
    this.progresbar_value.set(5);
    clearInterval(interval_id);
  }
}
