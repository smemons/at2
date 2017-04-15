import { AuthService } from './auth.service';



import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('inside CanActivate')




    if (this.authService.isLoggedIn()) {

      return true;
    }

    this.authService.redirectUrl = state.url;
    this.router.navigate(['/login']);
    return false;
  }
}
