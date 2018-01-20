import { UsernameValidators } from './Username.validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidators } from './Password.validators';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { isType } from '@angular/core/src/type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authFailed = false;
  form = new FormGroup({
    name: new FormControl('',
    [ 
      Validators.required,
      Validators.minLength(3),
      UsernameValidators.cannotContainSpace
    ]),
    password: new FormControl('', 
    [Validators.required,])
  })

  constructor(
    public auth: AuthService,
    public router: Router,
    public route: ActivatedRoute) { 
      if(auth.currentUser){
        this.router.navigate(['/']);
      }
    }

  ngOnInit() {

  }

  login(){
    let value = this.form.value;
    
    this.auth.login(value).subscribe(userIsAuthed => {
      
      if(userIsAuthed){
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/' ]);
      }else{
        this.authFailed = true;
      }
    },(err)=> {
      if (err instanceof HttpErrorResponse){
        this.authFailed = true;
        console.log('login failed');
      }
    }); 
  }
}
