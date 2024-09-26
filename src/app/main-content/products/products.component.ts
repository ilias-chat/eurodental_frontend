import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { ToastsService } from '../../shared/toasts-container/toast.service';
import { ProductFormComponent } from './product-form/product-form.component';
import { Product } from './product.model';
import { ProductComponent } from './product/product.component';
import { CategoriesComponent } from "./categories/categories.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductFormComponent, ProductComponent, CategoriesComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private ToastsService = inject(ToastsService);
  private productsService = inject(ProductsService);
  @ViewChild(CategoriesComponent) cateroies_component!:CategoriesComponent;
  @ViewChild(ProductFormComponent) product_form_component!:ProductFormComponent;
  all_products = signal<Product[]>([]);
  selected_products_ids = signal<number[]>([]);

  current_page = signal<number>(1);
  lines_per_page:number = 5;
  total_pages = signal<number>(1);
  total_products = signal<number>(0);

  start_index = signal<number>(0);
  end_index = signal<number>(this.lines_per_page);

  @ViewChild('search_input') search_input!: ElementRef;
  @ViewChild('combo_brand') combo_brand!: ElementRef;

  ngOnInit(){
    //this.all_products.set(this.productsService.filter('',''));
    this.all_products.set(this.productsService.all_products());

    this.reset_products_list();
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
    this.all_products.set(this.productsService.filter(search_input_value, brand_combo_value));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_products_list();
  }

  reset_products_list(){
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

    this.all_products.set(this.productsService.filter('',''));
    this.current_page.set(1);
    this.start_index.set(0);
    this.end_index.set(this.lines_per_page);
    this.reset_products_list();
  }

  on_form_submit(product:Product){
    if(product.id === 0){
      product.id = this.productsService.add(product);
      this.all_products.set([...this.all_products(),product]);
      this.reset_products_list();

      this.ToastsService.add("product have been created successfully", "success");
    } else {
      this.productsService.edit(product);

      this.all_products.set(this.all_products().map((cl) => {
          if (cl.id === product.id) {
            return product;
          }
          return cl;
        })
      );
      this.reset_products_list();

      this.ToastsService.add("Changes have been saved successfully", "success");
    }

  }

  on_product_edit(product:Product){
    this.product_form_component.init_form(product);
    this.product_form_component.open_dialog();
  }

  on_product_selected_change(param_id:number){

    console.log(param_id);
    if (this.selected_products_ids().includes(param_id)) {
      this.selected_products_ids.set(
        this.selected_products_ids().filter(id => id !== param_id)
      );
    }else{
      this.selected_products_ids.set([...this.selected_products_ids(), param_id])
    }
  }

  on_list_options_close_btn_click(){
    this.selected_products_ids.set([]);
  }

  on_sttings_btn_click(){
    this.cateroies_component.open_dialog();
  }
}
