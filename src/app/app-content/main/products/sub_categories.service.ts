import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

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
    private http_service = inject(HttpService);

    private api_url = this.http_service.api_url + '/sub_categories';

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
        return this.http_client.get<Sub_category[]>(this.api_url).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    add(sub_category:Sub_category):Observable<Object>{
        return this.http_client.post(this.api_url, sub_category).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit(sub_category:Sub_category):Observable<Object>{
        return this.http_client.put(this.api_url + '/'+sub_category.id, sub_category).pipe(
            catchError(this.http_service.handle_error)
        );
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