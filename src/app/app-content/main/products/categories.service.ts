import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

export interface Category{
    id:number,
    category:string,
}

@Injectable({
    providedIn:'root'
})
export class CategoriesService{
    categories = signal<Category[]>([]);

    private http_client = inject(HttpClient);
    private http_service = inject(HttpService);
    
    private api_url = this.http_service.api_url + '/categories';

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.categories.set((respond_data));
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Category[]>{
        return this.http_client.get<Category[]>(this.api_url).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    add(category:Category):Observable<Object>{
        return this.http_client.post(this.api_url , category).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit(category:Category):Observable<Object>{
        return this.http_client.put(this.api_url + '/'+category.id, category).pipe(
            catchError(this.http_service.handle_error)
        );
    }
    
    public set add_category(category:Category) {
        this.categories.set([...this.categories(), category]);
    }

    public set edit_category(category:Category) {
        this.categories.set(this.categories().map((br)=>{
            if(category.id === br.id){
                return category;
            }else{
                return br;
            }
        }));
    } 
}