import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";

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
    private api_url = 'http://35.180.66.24';

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.categories.set((respond_data));
              console.log(this.categories().length);
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Category[]>{
        return this.http_client.get<Category[]>('http://35.180.66.24/categories');
    }

    add(category:Category):Observable<Object>{
        return this.http_client.post(this.api_url + '/categories', category);
    }

    edit(category:Category):Observable<Object>{
        return this.http_client.put(this.api_url + '/categories/'+category.id, category);
    }
    
    public set add_brand(category:Category) {
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