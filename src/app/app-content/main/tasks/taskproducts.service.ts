import { inject, Injectable } from "@angular/core";
import { HttpService } from "../../../shared/http.service";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";

interface Task_product{
    id:number,
    product_reference:string,
    price:number,
    quantity:number,
    task_id:number
}

@Injectable({
    providedIn:'root'
})
export class TaskProductService{

    private http = inject(HttpClient);
    private http_service = inject(HttpService);
    private api_url = this.http_service.api_url + '/task_products/';

    add(task_product:Task_product):Observable<Object>{
        //task_product.product_reference = this.format_date_to_yyyy_mm_dd(new Date());
        return this.http.post(this.api_url,task_product).pipe(
            catchError(this.http_service.handle_error)
        )
    }

    edit(task_product:Task_product, product_id:number):Observable<Object>{
        return this.http.put(`${this.api_url}${product_id}`,task_product).pipe(
            catchError(this.http_service.handle_error)
        )
    }

    // format_date_to_yyyy_mm_dd(date: Date|undefined): string {

    //     if(date === undefined) return '';
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    //     const year = date.getFullYear();
      
    //     return `${year}-${month}-${day}`;
    // }
    
}