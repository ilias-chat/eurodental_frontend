import { Injectable,inject,signal } from "@angular/core";
import { Product } from "./product.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:'root'
})
export class ProductsService{
    private products = signal<Product[]>([]);
    all_products = this.products.asReadonly();

    private http = inject(HttpClient);
    private api_url = 'http://35.180.66.24';
    
    public set set_products(products:Product[]) {
      this.products.set(products);
    }

    all():Observable<Product[]>{
      return this.http.get<Product[]>('http://35.180.66.24/products');
    }
  
    filter(name:string, brand:string){
      if(name != '' && brand != ''){
        return this.products().filter((product)=>{
          return (product.product_name.toLowerCase().includes(name))
            && product.brand.toLowerCase() === brand.toLowerCase();
        });
      } else if (name != ''){
        return this.products().filter((product)=>{
          return (product.product_name.toLowerCase().includes(name));
        });
      } else if (brand != ''){
        return this.products().filter((product)=>{
          return product.brand.toLowerCase() === brand.toLowerCase();
        });
      }
      else return this.products();
    }
  
    add(product:FormData):Observable<Object>{
      return this.http.post(this.api_url + '/products', product);
    }
  
    edit(product:FormData, product_id:number):Observable<Object>{
      console.log(this.api_url+'/products/'+product_id, product);
      return this.http.put(this.api_url+'/products/'+product_id, product);
    }
    
    public set add_product(product:Product) {
      this.products.set([...this.products(), product]);
    }
  
    public set edit_product(product:Product) {
       this.products.set(
        this.products().map((cl) => {
          if (cl.id === product.id) {
            return product;
          }
          return cl;
        })
      ); 
    }
  
}