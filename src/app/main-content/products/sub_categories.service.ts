import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";

export interface Sub_category{
    id:number,
    category_id:number,
    sub_category:string,
  }

@Injectable({
    providedIn:'root'
})
export class SubCategoriesService{
    sub_categories = signal<Sub_category[]>([]);

    private http_client = inject(HttpClient);
    private api_url = 'http://35.180.66.24';

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.sub_categories.set((respond_data));
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Sub_category[]>{
        return this.http_client.get<Sub_category[]>('http://35.180.66.24/sub_categories');
    }

    add(sub_category:Sub_category):Observable<Object>{
        return this.http_client.post(this.api_url + '/sub_categories', sub_category);
    }

    edit(sub_category:Sub_category):Observable<Object>{
        return this.http_client.put(this.api_url + '/sub_categories/'+sub_category.id, sub_category);
    }
    
    public set add_sub_category(sub_category:Sub_category) {
        this.sub_categories.set([...this.sub_categories(), sub_category]);
    }

    public set edit_sub_category(sub_category:Sub_category) {
        this.sub_categories.set(this.sub_categories().map((cat)=>{
            if(sub_category.id === cat.id){
                return sub_category;
            }else{
                return cat;
            }
        }));
    } 
}