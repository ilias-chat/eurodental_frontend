import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { exhaustMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authentificationService = inject(AuthentificationService);

    return authentificationService.user.pipe(
        take(1),
        exhaustMap(user=>{
            if(!user){
                return next(req);
            }
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${user?.access_token}`,
                'Content-Type': 'application/json'
              });

             const modified_req =  req.clone({ headers });
            return next(modified_req);
        })
    )
};

// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {
//     private authentifiction_servise = inject(AuthentificationService);
    
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const headers = this.authentifiction_servise.get_headers();
//         return next.handle(req.clone({ headers }));
//     }
// }