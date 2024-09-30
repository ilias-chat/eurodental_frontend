import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ToastsService } from '../../../shared/toasts-container/toast.service';
import { FormsModule } from '@angular/forms';

interface Brand{
  id:number,
  brand:string,
}

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  is_open2 = signal<boolean>(false);

  private http_client = inject(HttpClient);
  private api_url = 'http://35.180.66.24';

  private Toasts_service = inject(ToastsService);

  brands = signal<Brand[]>([]);

  selected_brand:Brand = {id:0, brand:''};

  is_brand_form_open = signal<boolean>(false);

  is_progresbar_open = signal<boolean>(false);

  ngOnInit(){
    // this.http_client.get<Brand[]>(this.api_url+'/brands').subscribe({
    //   next:(respond_data)=>{
    //     this.brands.set((respond_data));
    //   },
    //   error:(err)=>{
    //     console.error(err.message);
    //   },
    // });
  }

  on_close(){
    this.close_dialog();
  }

  open_dialog(){
    this.is_open2.set(true);
  }

  close_dialog(){
    this.is_open2.set(false);
    this.is_brand_form_open.set(false);
    this.selected_brand = {id:0, brand:''};
  }

  on_new_brand_btn_click(){
    this.is_brand_form_open.set(true);
    this.selected_brand = {id:0, brand:''};
  }

  close_brand_form(){
    this.is_brand_form_open.set(false);
    this.selected_brand = {id:0, brand:''};
  }

  on_close_brand_form_btn_click(){
    this.close_brand_form();
  }

  on_edit_brand_btn_click(brand:Brand){
    this.selected_brand = {...brand};
    this.is_brand_form_open.set(true);
  }

  on_save_brand_btn_click(){
    this.is_progresbar_open.set(true);

    if (this.selected_brand.id === 0) {
      this.http_client.post(this.api_url+'/brands',{brand:this.selected_brand.brand}).subscribe({
        next:(respond_data)=>{
          this.selected_brand.id = (respond_data as Brand).id;
          this.brands.set([...this.brands(), this.selected_brand])
          this.close_brand_form();
          this.Toasts_service.add('brand has been created successfully', 'success');
          this.is_progresbar_open.set(false);
        },
        error:(err)=>{
          console.error(err.message);
          this.Toasts_service.add(err.message, 'danger');
          this.is_progresbar_open.set(false);
        },
      });
    }else{
      this.http_client.put(this.api_url+'/brands/'+this.selected_brand.id, {brand:this.selected_brand.brand}).subscribe({
        next:(respond_data)=>{
          this.brands.set(this.brands().map((cat)=>{
              if (cat.id === this.selected_brand.id) {
                return this.selected_brand;
              }else{
                return cat;
              }
            })
          );
          this.close_brand_form();
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

  on_brand_click(brand:Brand){
    this.selected_brand = {...brand}
    this.is_brand_form_open.set(false);
  }


}
