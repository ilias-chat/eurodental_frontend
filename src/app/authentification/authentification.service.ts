import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class AuthentificationService{
    
    private http = inject(HttpClient);
    private api_url = 'http://35.180.66.24/api/v1';

    private access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInByb2ZpbGVfaWQiOjIsImV4cCI6MTcyOTIyMDc5N30.oIz0VUyAJM9_ldCMZf3YHhdz0Nv1ud2x6_jJ8vfWZn4";
    private refresh_token = '';

    get_headers():HttpHeaders{
        return new HttpHeaders({
          'Authorization': `Bearer ${this.access_token}`,
          'Content-Type': 'application/json'
        });
    }
    
    public get get_api_url() : string {
        return this.api_url; 
    }
    

    login(username:string, password:string):Observable<Object>{

        const form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);

        return this.http.post(this.api_url + '/login', form_data);
    }
}