import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../app-content/main/products/product.model';
import { ProductsService } from '../../app-content/main/products/products.service';

@Component({
  selector: 'app-products-combobox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products-combobox.component.html',
  styleUrl: './products-combobox.component.css'
})
export class ProductsComboboxComponent {

  private products_service = inject(ProductsService);
  
  @Input({required:true}) value:string = '';
  @Input() is_valid:boolean = false;

  @ViewChild('combobox_input') combobox_input!:ElementRef;
  @ViewChild('options_list') options_list!:ElementRef;

  @Output() change = new EventEmitter<Product>();

  search_input_value = signal<string>('');

  products = signal<Product[]>([]);
  selected_product = signal<Product>(this.get_empty_product());

  ngOnInit(){
    this.get_all_technicians();
  }

  public get get_products() :Product[] {
    return this.products().filter((pro)=>{
      return pro.reference.toLowerCase().includes(this.search_input_value().toLowerCase()) || pro.product_name.toLowerCase().includes(this.search_input_value().toLowerCase());
    });
  }

  get_all_technicians(){
    this.products_service.all().subscribe({
      next:(res_data)=>{
        this.products.set(res_data);
      },
      error:(err_data)=>{
        console.log('combo products error:')
      },
    })
  }
    
  toggle_options() {
    this.options_list.nativeElement.classList.toggle('hidden');
  };

  hide_options() {
    this.options_list.nativeElement.classList.add('hidden');
  };

  // Select an option and display it in the input
  select_option(event:Event) {
    this.combobox_input.nativeElement.value = (event.target as HTMLDivElement).innerHTML;
    this.is_valid = true;
    this.hide_options();
    this.search_input_value.set('');

    const product_id = (event.target as HTMLDivElement).getAttribute('data-product_id');
    //this.change.emit(this.get_product_by_id(Number(product_id)));
    this.selected_product.set(this.get_product_by_id(Number(product_id)));
  }
  

  get_product_by_id(product_id:number):Product{
    const index:number = this.products().findIndex(product => product.id === product_id);
    return index!==-1?this.products()[index]:this.get_empty_product();
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
      price:0,
      stock_quantity:0,
      has_warranty:false ,
      warranty_duration_months:0,
      description:'',
      image_id:0,
    };
  }

}
