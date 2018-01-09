import { tokenNotExpired } from 'angular2-jwt';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    if (tokenNotExpired()) {
      return true;
    } else {
      this.router.navigate(['./login'], { queryParams: {returnUrl: state.url} });
      return false;
    }
  }
}
