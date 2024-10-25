import { Component, ElementRef, Signal, ViewChild, inject, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductFormComponent } from './product-form/product-form.component';
import { Product } from './product.model';
import { ProductComponent } from './product/product.component';
import { CategoriesComponent } from "./categories/categories.component";
import { BrandsComponent } from './brands/brands.component';
import { Brand, BrandsService } from './brands.service';
import { SkeletonRowListComponent } from '../../../shared/skeletons/skeleton-row-list/skeleton-row-list.component';
import { ToastsService } from '../../../shared/toasts-container/toast.service';
import { AddStockComponent } from './add-stock/add-stock.component';
import { AuthService } from '../../../authentification/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductFormComponent, 
    ProductComponent, 
    CategoriesComponent, 
    BrandsComponent, 
    SkeletonRowListComponent,
    AddStockComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  auth_service = inject(AuthService);
  private toasts_service = inject(ToastsService);
  private products_service = inject(ProductsService);
  private brand_service = inject(BrandsService);
  @ViewChild(CategoriesComponent) cateroies_component!:CategoriesComponent;
  @ViewChild(BrandsComponent) brands_component!:BrandsComponent;
  @ViewChild(ProductFormComponent) product_form_component!:ProductFormComponent;
  all_products = signal<Product[]>([]);
  selected_products_refs = signal<string[]>([]);

  current_page = signal<number>(1);
  lines_per_page:number = 12;
  total_pages = signal<number>(1);
  total_products = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_brand') combo_brand!: ElementRef;

  brands: Signal<Brand[]> = this.brand_service.brands;

  is_loading = signal(false);
  is_error = signal(false);
  is_add_quantity_form_open = signal(false);

  ngOnInit(){
    this.refresh_products();
    this.reset_pagination();
  }

  refresh_products(){
    
    this.is_loading.set(true);
    this.is_error.set(false);

    this.products_service.all().subscribe({
      next:(respond_data)=>{
        this.all_products.set(respond_data);
        this.products_service.set_products = respond_data;
        this.total_products.set(respond_data.length);
        this.filter_products();
        this.is_loading.set(false);
      },
      error:(err)=>{
        this.is_loading.set(false);
        this.is_error.set(true);
      },
    })
  } 

  get products(): Product[] {
    return this.all_products().slice(this.start_index(), this.end_index());
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
    this.product_form_component.open_dialog();
  }

  on_add_product(){
    this.open_form_dialog()
  }

  on_search_input_keyup(){
    this.filter_products();
  }

  on_combo_brand_change(){
    this.filter_products();
  }

  filter_products(){
    const search_input_value = this.search_input.nativeElement.value;
    const brand_combo_value = this.combo_brand.nativeElement.value;
    this.all_products.set(this.products_service.filter(search_input_value, brand_combo_value));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_pagination();
  }

  reset_pagination(){
    this.total_products.set(this.all_products().length);
    if(this.total_products() % this.lines_per_page == 0)
      this.total_pages.set(this.total_products()/this.lines_per_page);
    else
      this.total_pages.set(Math.trunc(this.total_products()/this.lines_per_page)+1);

    if (this.total_pages() === 0) this.total_pages.set(1);
  }

  on_reset_filter_click(){
    this.search_input.nativeElement.value = '';
    this.combo_brand.nativeElement.value = '';

    this.all_products.set(this.products_service.filter('',0));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_pagination();
  }

  on_form_submit(product_form_data:{form_data:FormData, product:Product}){
  
    this.product_form_component.show_progressbar();

    if(product_form_data.product.id === 0){
      this.products_service.add(product_form_data.form_data)
      .subscribe({
        next:(respond_data)=>{
          this.toasts_service.add("Product have been created successfully", "success");
          product_form_data.product.id = (respond_data as Product).id;
          this.products_service.add_product = product_form_data.product;
          this.filter_products();
          this.reset_and_close_form();
          this.product_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.product_form_component.hide_progressbar();
          this.product_form_component.error_message.set(err.message);
        },
      });     
    } else {
      this.products_service.edit(product_form_data.form_data, product_form_data.product.id).subscribe({
        next:(res)=>{
          this.toasts_service.add('Changes have been saved successfully','success');
          this.products_service.edit_product = product_form_data.product;
          this.filter_products();
          this.reset_and_close_form();
          this.product_form_component.hide_progressbar();
        },
        error:(err)=>{
          this.product_form_component.hide_progressbar();
          this.product_form_component.error_message.set(err.message);
        },
      });
    }
  }

  on_product_edit(product:Product){
    this.product_form_component.init_form(product);
    this.product_form_component.open_dialog();
  }

  on_product_selected_change(param_ref:string){

    if (this.selected_products_refs().includes(param_ref)) {
      this.selected_products_refs.set(
        this.selected_products_refs().filter(ref => ref !== param_ref)
      );
    }else{
      this.selected_products_refs.set([...this.selected_products_refs(), param_ref])
    }
  }

  on_list_options_close_btn_click(){
    this.selected_products_refs.set([]);
  }

  on_manage_categories_btn_click(){
    this.cateroies_component.open_dialog();
  }

  on_manage_brands_btn_click(){
    this.brands_component.open_dialog();
  }

  reset_and_close_form(){
    this.product_form_component.on_close();
    this.product_form_component.reset_selected_product();
  }

  show_add_quantity_from(){
    this.is_add_quantity_form_open.set(true);
  }

  on_add_quantity_form_save(quantity:number){
    this.products_service.add_qunatity_to_products({products_refs: this.selected_products_refs(), quantity: quantity}).subscribe({
      next:(res)=>{
        this.is_add_quantity_form_open.set(false);
        this.toasts_service.add('Changes have been saved successfully', 'success');
        this.selected_products_refs.set([]);
      },
      error:(err)=>{
        this.toasts_service.add(err.message, 'danger');
      },
    });
  }

  on_add_quantity_form_close(){
    this.is_add_quantity_form_open.set(false);
  }
}
