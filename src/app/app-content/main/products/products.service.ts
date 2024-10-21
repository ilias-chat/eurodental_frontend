import { Injectable,inject,signal } from "@angular/core";
import { Product } from "./product.model";
import { catchError, map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "../../../shared/http.service";

@Injectable({
    providedIn:'root'
})
export class ProductsService{
    private products = signal<Product[]>([]);
    all_products = this.products.asReadonly();

    private http = inject(HttpClient);
    private http_service = inject(HttpService);
    private api_url = this.http_service.api_url + '/products';
    
    public set set_products(products:Product[]) {
      this.products.set(products);
    }

    all():Observable<Product[]>{
      return this.http.get<Product[]>(this.api_url).pipe(
        catchError(this.http_service.handle_error)
      );
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
      return this.http.post(this.api_url, product).pipe(
        catchError(this.http_service.handle_error)
      );
    }
  
    edit(product:FormData, product_id:number):Observable<Object>{
      return this.http.put(this.api_url+'/'+product_id, product).pipe(
        catchError(this.http_service.handle_error)
      );
    }

    add_qunatity_to_products(data:{products_refs:string[], quantity:number}):Observable<Object>{
      
      const products = data.products_refs.map((ref)=>{
        return {reference: ref, stock_quantity: data.quantity}
      });

      return this.http.put(this.api_url+'/quantity', products).pipe(
        catchError(this.http_service.handle_error),
        tap(()=>{
          this.products().map((product)=>{
            if(data.products_refs.includes(product.reference)){
              if(product.stock_quantity)
                product.stock_quantity += data.quantity;
              else 
                product.stock_quantity = data.quantity;
            }
          });
        })
      );
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