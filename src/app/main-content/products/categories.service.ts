import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { AuthentificationService } from "../../authentification/authentification.service";

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
    private authentifiction_servise = inject(AuthentificationService);
    private api_url = this.authentifiction_servise.get_api_url + '/categories';

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
        return this.http_client.get<Category[]>(this.api_url);
    }

    add(category:Category):Observable<Object>{
        return this.http_client.post(this.api_url , category);
    }

    edit(category:Category):Observable<Object>{
        return this.http_client.put(this.api_url + '/'+category.id, category);
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