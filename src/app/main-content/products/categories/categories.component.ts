import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface Category{
  id:number,
  category:string,
}

interface Sub_category{
  id:number,
  category_id:number,
  Sub_category:string,
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  private http_client = inject(HttpClient);
  private api_url = 'http://35.180.66.24';

  categories = signal<Category[]>([]);
  sub_categories = signal<Sub_category[]>([]);

  selected_category:Category = {id:0, category:''};
  selected_subcategory:Sub_category = {id:0, category_id:0, Sub_category:''};

  @ViewChild('dialog') product_dialog!:ElementRef<HTMLDialogElement>;

  is_category_form_open = signal<boolean>(false);
  is_sub_category_form_open = signal<boolean>(false);

  ngOnInit(){
    this.http_client.get<Category[]>(this.api_url+'/categories').subscribe({
      next:(respond_data)=>{
        this.categories.set((respond_data));
      },
      error:(err)=>{
        console.error(err.message);
      },
    });
  }

  on_close(){
    this.close_dialog();
  }

  open_dialog(){
    this.product_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.product_dialog.nativeElement.close();
    this.is_category_form_open.set(false);
    this.selected_category = {id:0, category:''};
    this.is_sub_category_form_open.set(false);
    this.selected_subcategory = {id:0, category_id:0, Sub_category:''};
  }

  on_new_category_btn_click(){
    this.is_category_form_open.set(true);
  }

  on_new_sub_category_btn_click(){
    this.is_sub_category_form_open.set(true);
  }

  close_category_form(){
    this.is_category_form_open.set(false);
    this.selected_category = {id:0, category:''};
  }

  on_edit_category_btn_click(category:Category){
    this.selected_category = {...category};
    this.is_category_form_open.set(true);
  }

  on_save_category_btn_click(){
    if (this.selected_category.id === 0) {
      this.http_client.post(this.api_url+'/categories',{category:this.selected_category.category}).subscribe({
        next:(respond_data)=>{
          this.selected_category.id = (respond_data as Category).id;
          this.categories.set([...this.categories(), this.selected_category])
          this.close_category_form();
        },
        error:(err)=>{
          console.error(err.message);
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
        },
        error:(err)=>{
          console.error(err.message);
        },
      });
    }
  }

  on_save_sub_category_btn_click(){
    this.is_sub_category_form_open.set(false);
  }
}
