import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { Current_user } from "./current_user.model";
import { HttpService } from "../shared/http.service";
import { Profile, ProfilesService } from "../app-content/main/users/profiles.service";

interface AuthResponseData {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    image_path: string,
    profile: string,
    profile_id: number,
    access_token:string,
    access_token_expire_menutes:number,
    refresh_token:string,
    refresh_token_expire_menutes:number,
}

@Injectable({
    providedIn:'root'
})

export class AuthService{
    
    private http = inject(HttpClient);
    private http_service = inject(HttpService);
    private router = inject(Router);

    user = new BehaviorSubject<Current_user|null>(null);

    private _rights = signal<Profile | null>(null);

    
    public get rights() : Profile | null {
        return this._rights();
    }
    
    

    login(username:string, password:string):Observable<Object>{

        const form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);

        return this.http.post<AuthResponseData>(this.http_service.api_url + '/login', form_data)
        .pipe(
            catchError(this.http_service.handle_error), 
            tap(response_data=>{
                const access_token_expiraton_date = new Date(new Date().getTime() + (response_data.access_token_expire_menutes*60000));
                const refresh_token_expiraton_date = new Date(new Date().getTime() + (response_data.refresh_token_expire_menutes*60000));

                const user = new Current_user(
                    response_data.id,
                    response_data.email,
                    response_data.first_name,
                    response_data.last_name,
                    response_data.image_path,
                    response_data.profile,
                    response_data.profile_id,
                    response_data.access_token,
                    access_token_expiraton_date,
                    response_data.refresh_token,
                    refresh_token_expiraton_date,
                );
                this.user.next(user);
                localStorage.setItem('user_data',JSON.stringify(user));

                this.get_user_rights(user.id);

                console.log("login: ",user);
            })
        );
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('user_data');
        this._rights.set(null);
    }

    auto_login(){
        const user_data:{
            id: number,
            email: string,
            first_name: string,
            last_name: string,
            image_path: string,
            profile: string,
            profile_id: number,
            _access_token:string,
            _access_token_expires_in: string,
            _refresh_token:string
            _refresh_token_expires_in: string,
        } = JSON.parse(localStorage.getItem('user_data')!);

        if(!user_data) return;

        const loaded_user = new Current_user(
            user_data.id,
            user_data.email,
            user_data.first_name,
            user_data.last_name,
            user_data.image_path,
            user_data.profile,
            user_data.profile_id,
            user_data._access_token,
            new Date(user_data._access_token_expires_in),
            user_data._refresh_token,
            new Date(user_data._refresh_token_expires_in),
        );

        console.log("auto login: ",loaded_user);

        if(loaded_user.access_token){
            this.user.next(loaded_user);
            this.get_user_rights(loaded_user.id);
        }
    }

    refresh_access_token(): Observable<Object> {
        
        // Get the current user object from BehaviorSubject
        const current_user = this.user.value; 
    
        // Ensure we have a refresh token
        if (!current_user || !current_user.refresh_token) {
            return throwError(() => new Error('No refresh token available.'));
        }
    
        return this.http.post<AuthResponseData>(
            this.http_service.api_url + '/refresh_token',
            {}, // Empty body (no payload required)
            {
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${current_user.refresh_token}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json' 
                })
            }
        )
        .pipe(
            catchError(this.http_service.handle_error),  
            tap(response_data => {
                // Update expiration date for the new access token
                const access_token_expiraton_date = new Date(new Date().getTime() + (response_data.access_token_expire_menutes*60000));
                const refresh_token_expiraton_date = new Date(new Date().getTime() + (response_data.refresh_token_expire_menutes*60000));

                const updated_user = new Current_user(
                    response_data.id,
                    response_data.email,
                    response_data.first_name,
                    response_data.last_name,
                    response_data.image_path,
                    response_data.profile,
                    response_data.profile_id,
                    response_data.access_token,
                    access_token_expiraton_date,
                    response_data.refresh_token || current_user.refresh_token, // Use the new refresh token if provided, otherwise keep the old one
                    refresh_token_expiraton_date,
                );

                // Emit the updated user to the BehaviorSubject
                this.user.next(updated_user);

                // Persist the updated user data to localStorage
                localStorage.setItem('user_data', JSON.stringify(updated_user));
            })
        );
    }

    get_user_rights(user_id:number){

        this.http.get<Profile>(this.http_service.api_url + '/rights/' + user_id).pipe(
            catchError(this.http_service.handle_error)
        ).subscribe({
            next:(res_data)=>{
                this._rights.set(res_data);
            },
            error:(err)=>{
                console.log(err);
            },
        });
        
    }
    
}