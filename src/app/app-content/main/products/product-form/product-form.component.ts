import { Component, ElementRef, EventEmitter, Output, Signal, ViewChild, inject, signal } from '@angular/core';
import { Product } from '../product.model';
import { FormsModule } from '@angular/forms';
import { Brand, BrandsService } from '../brands.service';
import { CategoriesService, Category } from '../categories.service';
import { SubCategoriesService, Sub_category } from '../sub_categories.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  invalid_inputs = signal<string[]>([]);
  error_message = signal('');

  selected_product:Product = this.get_empty_product();
  @ViewChild('dialog') product_dialog!:ElementRef<HTMLDialogElement>;
  @ViewChild('form') product_form!:ElementRef<HTMLFormElement>;
  
  @Output() submit = new EventEmitter<{form_data:FormData, product:Product}>();

  private brands_service = inject(BrandsService);
  private categoris_service = inject(CategoriesService);
  private sub_categoris_service = inject(SubCategoriesService);

  brands: Signal<Brand[]> = this.brands_service.brands;
  categories: Signal<Category[]> = this.categoris_service.categories;
  sub_categories: Signal<Sub_category[]> = this.sub_categoris_service.sub_categories;
  selected_category_id = signal(0);

  is_progressbar_open = signal(false);

  on_close(){
    this.close_dialog();
    this.selected_product = this.get_empty_product();
    this.product_form.nativeElement.reset();
    this.invalid_inputs.set([]);
    this.error_message.set('');
  }

  open_dialog(){
    this.product_dialog.nativeElement.showModal();
  }

  close_dialog(){
    this.product_dialog.nativeElement.close();
  }

  on_save_btn_click(img_input:HTMLInputElement){
    this.error_message.set('');
    this.invalid_inputs.set([]);

    if(!this.selected_product.product_name)
      this.invalid_inputs.set([...this.invalid_inputs(), 'product_name']);
    if(!this.selected_product.reference)
      this.invalid_inputs.set([...this.invalid_inputs(), 'reference']);
    if(!this.selected_product.id_brand || this.selected_product.id_brand === 0)
      this.invalid_inputs.set([...this.invalid_inputs(), 'brand_id']);
    if(!this.selected_product.id_category || this.selected_product.id_category === 0)
      this.invalid_inputs.set([...this.invalid_inputs(), 'category_id']);
    if(!this.selected_product.id_sub_category || this.selected_product.id_sub_category === 0)
      this.invalid_inputs.set([...this.invalid_inputs(), 'sub_category_id']);
    if(!this.selected_product.price || this.selected_product.price == null)
      this.invalid_inputs.set([...this.invalid_inputs(), 'price']);
    if(this.selected_product.has_warranty && (!this.selected_product.warranty_duration_months || this.selected_product.warranty_duration_months == null))
      this.invalid_inputs.set([...this.invalid_inputs(), 'warranty_duration_months']);
    if(this.selected_product.stock_quantity == null)
      this.invalid_inputs.set([...this.invalid_inputs(), 'stock_quantity']);

    if(this.invalid_inputs().length > 0) return;

      const form_data = new FormData();
      // Add the product data as a JSON string
      form_data.append('product_name', this.selected_product.product_name);
      form_data.append('description', this.selected_product.description);
      form_data.append('id_category', this.selected_product.id_category?.toString());
      form_data.append('id_sub_category', this.selected_product.id_sub_category?.toString());
      form_data.append('id_brand', this.selected_product.id_brand!?.toString());
      form_data.append('price', this.selected_product.price!?.toString());
      form_data.append('stock_quantity', this.selected_product.stock_quantity!?.toString());
      form_data.append('has_warranty', this.selected_product.has_warranty?.toString());
      form_data.append('warranty_duration_months', this.selected_product.warranty_duration_months!?.toString());
      form_data.append('reference', this.selected_product.reference);
      if(img_input?.files && img_input?.files[0]){
        form_data.append('image', img_input.files[0]);
      } 
  
      this.submit.emit({form_data:form_data, product:this.selected_product});
  }

  get_empty_product():Product{
    return {
      id: 0,
      product_name: '',
      reference:'',
      image_path:'',
      brand_name:'',
      id_category:0,
      category_name:'',
      id_sub_category:0,
      sub_category_name:'',
      id_brand:0,
      price:null,
      stock_quantity:null,
      has_warranty:false ,
      warranty_duration_months:0,
      description:'',
      image_id:0,
    };
  }

  init_form(product:Product){
    this.selected_product = { ...product };
    this.selected_category_id.set(this.selected_product.id_category);
  }

  on_img_input_change(event:Event){
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      this.selected_product.image_path = URL.createObjectURL(input.files[0]);
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
      this.selected_product.image_path = URL.createObjectURL(img_input.files[0]);
    }
  }

  public get sub_categories_by_category() : Sub_category[] {
    return this.sub_categories().filter((cat)=>{
      return cat.category_id == this.selected_category_id();
    })
  }

  on_combo_category_change(select_element:HTMLSelectElement){
    this.selected_category_id.set(this.selected_product.id_category);
    
    this.selected_product.category_name = select_element.options[select_element.selectedIndex].innerHTML;
  }

  on_combo_sub_category_change(select_element:HTMLSelectElement){
    this.selected_product.sub_category_name = select_element.options[select_element.selectedIndex].innerHTML;
  }

  on_combo_brand_change(select_element:HTMLSelectElement){
    this.selected_product.brand_name = select_element.options[select_element.selectedIndex].innerHTML;
  }

  show_progressbar(){
    this.is_progressbar_open.set(true);
  }

  hide_progressbar(){
    this.is_progressbar_open.set(false);
  }

  reset_selected_product(){
    this.selected_product = this.get_empty_product();
  }

  clear_error_message(){
    this.error_message.set('');
  }
}
