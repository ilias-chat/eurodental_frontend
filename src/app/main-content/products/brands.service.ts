import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { AuthentificationService } from "../../authentification/authentification.service";

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
    private authentifiction_servise = inject(AuthentificationService);
    private api_url = this.authentifiction_servise.get_api_url + '/brands';

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.brands.set((respond_data));
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Brand[]>{
        return this.http_client.get<Brand[]>(this.api_url);
    }

    add(brand:Brand):Observable<Object>{
        return this.http_client.post(this.api_url, brand);
    }

    edit(brand:Brand):Observable<Object>{
        return this.http_client.put(this.api_url + '/' +brand.id, brand);
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