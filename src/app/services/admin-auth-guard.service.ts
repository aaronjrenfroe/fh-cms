import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { Router } from '@angular/router';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    // tslint:disable-next-line:prefer-const
    let user = this.authService.currentUser;
    if (user && user.access == 'admin') {
      return true;
    } else {
      this.router.navigate(['./no-access']);
      return false;
    }
  }
}
