import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

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
    private http_service = inject(HttpService);

    private api_url = this.http_service.api_url + '/brands';

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
        return this.http_client.get<Brand[]>(this.api_url).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    add(brand:Brand):Observable<Object>{
        return this.http_client.post(this.api_url, brand).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit(brand:Brand):Observable<Object>{
        return this.http_client.put(this.api_url + '/' +brand.id, brand).pipe(
            catchError(this.http_service.handle_error)
        );
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