import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, switchMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth_service = inject(AuthService);

    return auth_service.user.pipe(
        take(1),
        exhaustMap(user=>{
            if(!user || req.url.includes('login') || req.url.includes('refresh_token')){
                return next(req);
            }

            if(!user.expires_in || new Date() > user.expires_in){
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