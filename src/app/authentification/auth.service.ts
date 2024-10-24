import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { Current_user } from "./current_user.model";
import { HttpService } from "../shared/http.service";

interface AuthResponseData {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    image_path: string,
    profile: string,
    profile_id: number,
    access_token:string,
    refresh_token:string,
}

@Injectable({
    providedIn:'root'
})

export class AuthService{
    
    private http = inject(HttpClient);
    private http_service = inject(HttpService);
    private router = inject(Router);

    user = new BehaviorSubject<Current_user|null>(null);
    

    login(username:string, password:string):Observable<Object>{

        const form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);

        return this.http.post<AuthResponseData>(this.http_service.api_url + '/login', form_data)
        .pipe(
            catchError(this.http_service.handle_error), 
            tap(response_data=>{
                const expiraton_date = new Date(new Date().getTime() + (30*60000));
                const user = new Current_user(
                    response_data.id,
                    response_data.email,
                    response_data.first_name,
                    response_data.last_name,
                    response_data.image_path,
                    response_data.profile,
                    response_data.profile_id,
                    response_data.access_token,
                    expiraton_date,
                    response_data.refresh_token,
                );
                this.user.next(user);
                localStorage.setItem('user_data',JSON.stringify(user));
            })
        );
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('user_data');
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
            _access_token_expiration_date: string,
            _refresh_token:string
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
            new Date(user_data._access_token_expiration_date),
            user_data._refresh_token
        );

        if(loaded_user.access_token){
            this.user.next(loaded_user);
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
                    'Authorization': `Bearer ${current_user.refresh_token}`, // Use refresh token in headers if needed
                    'Content-Type': 'application/json',
                    'accept': 'application/json' // Accept header as specified in the FastAPI docs
                })
            }
        )
        .pipe(
            catchError(this.http_service.handle_error),  // Handle any errors during token refresh
            tap(response_data => {
                // Update expiration date for the new access token
                const expiraton_date = new Date(new Date().getTime() + (30*60000));

                // Create new Current_user object with updated tokens and expiration
                const updated_user = new Current_user(
                    response_data.id,
                    response_data.email,
                    response_data.first_name,
                    response_data.last_name,
                    response_data.image_path,
                    response_data.profile,
                    response_data.profile_id,
                    response_data.access_token,
                    expiraton_date,
                    response_data.refresh_token || current_user.refresh_token // Use the new refresh token if provided, otherwise keep the old one
                );

                // Emit the updated user to the BehaviorSubject
                this.user.next(updated_user);

                // Persist the updated user data to localStorage
                localStorage.setItem('user_data', JSON.stringify(updated_user));
            })
        );
    }
    
}