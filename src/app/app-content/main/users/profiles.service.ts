import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

export interface Profile{
    id:number,
    id_profile:number,
    profile_name:string,
    invoices_read: boolean,
    invoices_write: boolean,
    clients_read: boolean,
    clients_write: boolean,
    products_read: boolean,
    products_write: boolean,
    tasks_read: boolean,
    tasks_write: boolean,
    users_read: boolean,
    users_write: boolean,
    mobile_tasks_read: boolean,
    mobile_tasks_write: boolean,
    mobile_stock_read: boolean,
    mobile_stock_write: boolean,
}

@Injectable({
    providedIn:'root'
})
export class ProfilesService{
    profiles = signal<Profile[]>([]);

    private http_client = inject(HttpClient);
    private http_service = inject(HttpService);
    private api_url = this.http_service.api_url;

    constructor(){
        this.all().subscribe({
            next:(respond_data)=>{
              this.profiles.set((respond_data));
            },
            error:(err)=>{
              console.error(err.message);
            },
        });
    }

    all():Observable<Profile[]>{
        return this.http_client.get<Profile[]>(this.api_url + '/rights').pipe(
            catchError(this.http_service.handle_error)
        );
    }

    add(profile:{profile_name:string, id:number}):Observable<Object>{
        return this.http_client.post(this.api_url + '/profiles', profile).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit(profile:{profile_name:string, id:number}):Observable<Object>{
        return this.http_client.put(this.api_url + '/profiles' + '/'+profile.id, profile).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit_right(profile:Profile):Observable<Object>{
        return this.http_client.put(this.api_url + '/rights' + '/'+profile.id, profile).pipe(
            catchError(this.http_service.handle_error)
        );
    }
    
    public set add_profile(profile:Profile) {
        this.profiles.set([...this.profiles(), profile]);
    }

    public set edit_profile(profile:Profile) {
        this.profiles.set(this.profiles().map((br)=>{
            if(profile.id === br.id){
                return profile;
            }else{
                return br;
            }
        }));
    } 
}