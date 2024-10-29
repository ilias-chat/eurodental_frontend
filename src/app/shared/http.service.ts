import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class HttpService{
    private _api_url = 'http://35.180.66.24/api/v1';
    //private _api_url = 'http://127.0.0.1:8000/api/v1';

    public get api_url() : string {
        return this._api_url;
    }

    public handle_error(respose_error: HttpErrorResponse){
        let error_message = 'An unknown error occurred!';
    
        // Server-side error
        switch (respose_error.status) {
          case 400:
              error_message = 'Bad Request. Please check your input.';
              break;
          case 401:
              error_message = 'Unauthorized. Invalid credentials.';
              break;
          case 403:
              error_message = 'Forbidden. You do not have permission.';
              break;
          case 404:
              error_message = 'Resource not found.';
              break;
          case 500:
              error_message = 'Internal Server Error. Please try again later.';
              break;
          default:
              error_message = `Error Code: ${respose_error.status}\nMessage: ${respose_error.error?.error_detail}`;
        }
    
        return throwError(() => new Error(error_message));
    }
    
}