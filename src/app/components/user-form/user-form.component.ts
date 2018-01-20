import { ValidationErrors } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { UsernameValidators } from './../login/Username.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent{

  passwordMissmatch = false;
  form = new FormGroup({
    name: new FormControl('',
    [ 
      Validators.required,
      Validators.minLength(3)
    ]),
    username: new FormControl('',
    [ 
      Validators.required,
      Validators.minLength(3),
      UsernameValidators.cannotContainSpace
    ]),
    password: new FormControl('', 
    [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', 
    [Validators.required,]),
    role: new FormControl(''),
  })

  constructor(public userService: UserService, public router: Router) { }

  passCheck(){
    if(this.password.value != this.password2.value){
     this.passwordMissmatch = true
    }else{
      this.passwordMissmatch = false
    }
  }

  submit(){
    
    if(!this.form.valid){
      
    }else{
      let val = this.form.value;
      let newUser = {
        name: val.name,
        username: val.username,
        password: val.password,
        privleges: val.role
      };
      
      
      this.userService.create(newUser).subscribe((user) => {
        if(user){
          this.router.navigate(['/users']);
        }
      },(error) => {
        
      });
    }
  }

  get name(){
    return this.form.get('name');
  }

  get role(){
    return this.form.get('role');
  }
  get username(){
    return this.form.get('username');
  }

  get password(){
    return this.form.get('password');
  }

  get password2(){
    return this.form.get('password2');
  }

}
