import { Injectable,inject,signal } from "@angular/core";
import { Product } from "./product.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthentificationService } from "../../../authentification/auth.service";

@Injectable({
    providedIn:'root'
})
export class ProductsService{
    private products = signal<Product[]>([]);
    all_products = this.products.asReadonly();

    private http = inject(HttpClient);
    private authentifiction_servise = inject(AuthentificationService);
    private api_url = this.authentifiction_servise.get_api_url + '/products';
    
    public set set_products(products:Product[]) {
      this.products.set(products);
    }

    all():Observable<Product[]>{
      return this.http.get<Product[]>(this.api_url);
    }
  
    filter(name:string, id_brand:number){
      
      if(name != '' && id_brand != 0){
        return this.products().filter((product)=>{
          return (product.product_name.toLowerCase().includes(name))
            && product.id_brand == id_brand
        });
      } else if (name != ''){
        return this.products().filter((product)=>{
          return (product.product_name.toLowerCase().includes(name));
        });
      } else if (id_brand != 0){
        return this.products().filter((product)=>{
          return product.id_brand == id_brand;
        });
      }
      else return this.products();
    }
  
    add(product:FormData):Observable<Object>{
      return this.http.post(this.api_url, product);
    }
  
    edit(product:FormData, product_id:number):Observable<Object>{
      return this.http.put(this.api_url+'/'+product_id, product);
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