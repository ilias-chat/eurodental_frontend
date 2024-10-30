import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpService } from "../shared/http.service";
import { Profile } from "../app-content/main/users/profiles.service";

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

interface Current_user{
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    image_path:string,
    profile: string,
    profile_id: number,
}

@Injectable({
    providedIn:'root'
})

export class AuthService{
    
    private http = inject(HttpClient);
    private http_service = inject(HttpService);
    private router = inject(Router);

    private _user = signal<Current_user | null>(null);
    private _rights = signal<Profile | null>(null);
    private _access_token = signal<string>('');
    private _refresh_token = signal<string>('');

    
    public get rights() : Profile | null {
        return this._rights();
    }

    
    public get access_token() : string {
        return this._access_token();
    }

    public get refresh_token() : string {
        return this._refresh_token();
    }

    public get user() : Current_user | null {
        return this._user();
    }
    
    logout(){
        this._user.set(null);
        this._rights.set(null); 
        this._access_token.set('');
        this._refresh_token.set('');
        this.router.navigate(['/login']);
        localStorage.removeItem('user_data');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    login(username:string, password:string):Observable<Object>{

        const form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);

        return this.http.post<AuthResponseData>(this.http_service.api_url + '/login', form_data)
        .pipe(
            //catchError(this.http_service.handle_error), 
            tap(response_data=>{
                this._user.set(response_data);
                this._access_token.set(response_data.access_token);
                this._refresh_token.set(response_data.refresh_token);
                // console.log("access token: ", this.access_token);
                // console.log("refresh token: ", this.refresh_token);
                this.get_user_rights(this._user()?.profile_id);

                localStorage.setItem('user_data',JSON.stringify(this._user()));
                localStorage.setItem('access_token',JSON.stringify(this._access_token()));
                localStorage.setItem('refresh_token',JSON.stringify(this._refresh_token()));
            })
        );
    }

    refresh_access_token(): Observable<{access_token:string}> {
        return this.http.post<{access_token:string}>(
            `${this.http_service.api_url}/refresh_token`,
             {},
             {
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${this.refresh_token}`
                })
            }
            ).pipe(
            tap(response_data => {
                this._access_token.set(response_data.access_token);
            }),
            catchError(error => {
                console.error('Error refreshing token:', error);
                return throwError(() => error);
            })
        );
    }

    auto_login(){
        const stored_user:Current_user = JSON.parse(localStorage.getItem('user_data')!);
        const stored_access_token:string = JSON.parse(localStorage.getItem('access_token')!);
        const stored_refresh_token:string = JSON.parse(localStorage.getItem('refresh_token')!);

        if(!stored_access_token || !stored_refresh_token || !stored_user) return;

        this._user.set(stored_user);
        this._access_token.set(stored_access_token);
        this._refresh_token.set(stored_refresh_token);
        this.get_user_rights(this._user()?.profile_id);
    }

    change_password(old_password:string, new_password:string):Observable<Object>{
        return this.http.post(
            `${this.http_service.api_url}/change_password`,
            {id:this.user?.id, old_password:old_password, new_password:new_password}
        );
    }

    reset_password(email:string):Observable<Object>{
        return this.http.post(
            `${this.http_service.api_url}/reset_password`,
            {email:email}
        ).pipe(
            catchError(this.http_service.handle_error)
        )
    }

    // login(username:string, password:string):Observable<Object>{

    //     const form_data = new FormData();
    //     form_data.append('username', username);
    //     form_data.append('password', password);

    //     return this.http.post<AuthResponseData>(this.http_service.api_url + '/web/login', form_data)
    //     .pipe(
    //         catchError(this.http_service.handle_error), 
    //         tap(response_data=>{
    //             this._user.set(response_data);
    //             this._access_token.set(response_data.access_token);
    //             console.log(this.access_token)
    //             this.get_user_rights(this._user()?.profile_id);

    //             localStorage.setItem('user_data',JSON.stringify(this._user()));
    //         })
    //     );
    // }

    // auto_login(){
    //     const loaded_user:Current_user = JSON.parse(localStorage.getItem('user_data')!);

    //     if(!loaded_user) return;

    //     this._user.set(loaded_user);
    // }

    // refresh_access_token(): Observable<any> {
    //     return this.http.post<any>(`${this.http_service.api_url}/web/refresh_token`, {}, { withCredentials: true }).pipe(
    //         tap(response_data => {
    //             console.log(response_data);
    //             this._access_token.set(response_data)
    //         }),
    //         catchError(error => {
    //             console.error('Error refreshing token:', error);
    //             return throwError(() => error);
    //         })
    //     );
    // }
    

    get_user_rights(profile_id:number|undefined){

        if(!profile_id) return;

        this.http.get<Profile>(this.http_service.api_url + '/rights/' + profile_id).pipe(
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