import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth_service = inject(AuthService);

    if (req.url.includes('login') || req.url.includes('refresh_token') || req.url.includes('reset_password')) {
        return next(req);
    }

    let auth_request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${auth_service.access_token}`)
    });

    return next(auth_request).pipe(
        catchError((error) => {

            if (error.status === 401) {
                // If a 401 error occurs, attempt to refresh the access token
                return auth_service.refresh_access_token().pipe(
                    switchMap(response_data => {
                        return next(req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${response_data.access_token}`)
                        }));
                    }),
                    catchError(() => {
                        auth_service.logout(); // Log out on refresh failure
                        return throwError(() => new Error('Unauthorized'));
                    })
                );
            }
            // If not a 401 error, pass the error through
            return throwError(() => error);
        })
    );
};