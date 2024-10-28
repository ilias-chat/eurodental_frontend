import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, exhaustMap, switchMap, take, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth_service = inject(AuthService);

    // return auth_service.user.pipe(
    //     switchMap(user => {
    //         // If there is no user or if the request is for login or refresh_token, proceed without modifying the request
    //         if (req.url.includes('login') || req.url.includes('refresh_token')) {
    //             return next(req);
    //         }

    //         // If the user exists, but we don't have an access token
    //         // if (!user.access_token) {
    //         //     // Optionally handle the case where access_token is missing
    //         //     return next(req);
    //         // }

    //         // If the request fails with a 401 error, we can refresh the token
    //         return next(req.clone({
    //             headers: req.headers.set('Authorization', `Bearer ${user?.access_token}`)
    //         })).pipe(
    //             catchError((error) => {
    //                 if (error.status === 401) {
    //                     // Attempt to refresh the access token
    //                     return auth_service.refresh_access_token().pipe(
    //                         switchMap(response_data => {
    //                             const newAccessToken = (response_data as { access_token: string }).access_token;

    //                             // Retry the original request with the new access token
    //                             return next(req.clone({
    //                                 headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
    //                             }));
    //                         }),
    //                         catchError(() => {
    //                             auth_service.logout();
    //                             return next(req); // Proceed with the original request, or handle as needed
    //                         })
    //                     );
    //                 }
    //                 // If not a 401 error, pass the error through
    //                 return throwError(error);
    //             })
    //         );
    //     })
    // )

    return auth_service.user.pipe(
        take(1),
        exhaustMap(user=>{
            if(!user || req.url.includes('login') || req.url.includes('refresh_token')){
                return next(req);
            }

            if(!user.access_token_expires_in || new Date() > user.access_token_expires_in){
                return auth_service.refresh_access_token().pipe(
                    switchMap(response_data=>{
                        const headers = new HttpHeaders({
                            'Authorization': `Bearer ${(response_data as {access_token:string}).access_token}`,
                        });
                        return next(req.clone({ headers }));
                    })
                )
            }

            const headers = new HttpHeaders({
                'Authorization': `Bearer ${user?.access_token}`,
            });

            return next(req.clone({ headers }));
        })
    )
};