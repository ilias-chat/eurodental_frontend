import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { HttpService } from "../../../shared/http.service";

export interface Profile{
    id:number,
    profile_name:string,
}

@Injectable({
    providedIn:'root'
})
export class ProfilesService{
    profiles = signal<Profile[]>([]);

    private http_client = inject(HttpClient);
    private http_service = inject(HttpService);
    private api_url = this.http_service.api_url + '/profiles';

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
        return this.http_client.get<Profile[]>(this.api_url).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    add(profile:Profile):Observable<Object>{
        return this.http_client.post(this.api_url, profile).pipe(
            catchError(this.http_service.handle_error)
        );
    }

    edit(profile:Profile):Observable<Object>{
        return this.http_client.put(this.api_url + '/'+profile.id, profile).pipe(
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