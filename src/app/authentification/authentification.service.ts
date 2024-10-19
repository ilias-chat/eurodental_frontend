import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { Current_user } from "./current_user.model";

interface AuthResponseData {
    access_token: string,
    refresh_token: string
}

@Injectable({
    providedIn:'root'
})

export class AuthentificationService{
    
    private http = inject(HttpClient);
    private router = inject(Router);
    private api_url = 'http://35.180.66.24/api/v1';

    user = new BehaviorSubject<Current_user|null>(null);
    
    public get get_api_url() : string {
        return this.api_url; 
    }
    

    login(username:string, password:string):Observable<Object>{

        const form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);

        return this.http.post<AuthResponseData>(this.api_url + '/login', form_data)
        .pipe(
            catchError(this.handle_error), 
            tap(respose_data=>{
                const expiraton_date = new Date();
                const user = new Current_user(
                    0,
                    'test@email.com',
                    respose_data.access_token,
                    expiraton_date,
                    respose_data.refresh_token,
                );
                console.log(respose_data);
                this.user.next(user);
                localStorage.setItem('user_data',JSON.stringify(user));
            })
        );
    }

    private handle_error(respose_error: HttpErrorResponse){
        let error_message = 'An unknown error occurred!'
        return throwError(error_message);
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
            _access_token:string,
            _access_token_expiration_date: string,
            _refresh_token:string
        } = JSON.parse(localStorage.getItem('user_data')!);

        if(!user_data) return;

        const loaded_user = new Current_user(
            user_data.id,user_data.email,
            user_data._access_token,
            new Date(user_data._access_token_expiration_date),
            user_data._refresh_token
        );

        if(loaded_user.access_token){
            this.user.next(loaded_user);
        }
    }
}