import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthentificationService } from './authentification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authentificationService = inject(AuthentificationService);
    const headers = authentificationService.get_headers();
    return next(req.clone({ headers }));
};

// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {
//     private authentifiction_servise = inject(AuthentificationService);
    
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const headers = this.authentifiction_servise.get_headers();
//         return next.handle(req.clone({ headers }));
//     }
// }