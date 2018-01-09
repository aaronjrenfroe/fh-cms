import { UsernameValidators } from './Username.validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidators } from './Password.validators';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs/Observable';

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
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) { 
      if(auth.currentUser){
        this.router.navigate(['/']);
      }
    }

  ngOnInit() {

  }

  login(){
    let value = this.form.value;
    console.log("Im at 1");
    this.auth.login(value).subscribe(userIsAuthed => {
      console.log("Are we stuck here? ", userIsAuthed);
      console.log("Im at 4");
      if(userIsAuthed){
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/' ]);
      }else{
        this.authFailed = true;
      }
    });
    console.log("Im at 5");
  }
}
