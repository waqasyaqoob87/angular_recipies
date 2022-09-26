import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, pipe, map, tap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router
    ) { }
    // canActivate(route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot):
    //     boolean | Observable<boolean> | Promise<boolean> | any {

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | any {
        return this.authService.user.pipe(
            // take(1),
            map(user => {

                return !!user;

                // const isAuth = !!user;
                // if (!isAuth) {
                //     return this.router.createUrlTree(['/auth'])
                // }
                // return true;
             }),
              tap(isAuth => {
                if(!isAuth){
                    this.router.navigate(['/auth'])
                }
             })
        );
    }
}