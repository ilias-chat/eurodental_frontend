import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs";

export const Auth_guard: CanActivateFn = () => {
    const auth_service = inject(AuthService);
    const router = inject(Router);

    return auth_service.user.pipe(
        take(1),
        map(user=>{
            const is_auth = !!user;
            if (is_auth){
                return true;
            }
            return router.createUrlTree(['/login']);
        })
    );
};

// @Injectable()
// export class Auth_guard implements CanActivate{
//     auth_service = inject(AuthentificationService)
//     router = inject(Router)

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
//         return this.auth_service.user.pipe(
//             take(1),
//             map(user=>{
//                 const is_auth = !!user;
//                 if (is_auth){
//                     return true;
//                 }
//                 return this.router.createUrlTree(['/login']);
//             })
//         )
//     }
// }