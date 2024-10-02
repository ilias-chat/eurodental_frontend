import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";

export interface Brand{
    id:number,
    brand:string,
}

@Injectable({
    providedIn:'root'
})
export class BrandsService{
    brands = signal<Brand[]>([]);

    private http_client = inject(HttpClient);
    private api_url = 'http://35.180.66.24';

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.brands.set((respond_data));
              console.log(this.brands().length);
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Brand[]>{
        return this.http_client.get<Brand[]>('http://35.180.66.24/brands');
    }

    add(brand:Brand):Observable<Object>{
        return this.http_client.post(this.api_url + '/brands', brand);
    }

    edit(brand:Brand):Observable<Object>{
        return this.http_client.put(this.api_url + '/brands/'+brand.id, brand);
    }
    
    public set add_brand(brand:Brand) {
        this.brands.set([...this.brands(), brand]);
    }

    public set edit_brand(brand:Brand) {
        this.brands.set(this.brands().map((br)=>{
            if(brand.id === br.id){
                return brand;
            }else{
                return br;
            }
        }));
    } 
}