import { Router } from '@angular/router';
import { UsernameValidators } from './../login/Username.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  user;
  userForm;
  passwordForm = this.getNewPasswordForm();

  constructor(public userService: UserService, public postService: PostService, public auth: AuthService, private router: Router) {
    this.user = auth.currentUser;
    this.userForm = this.getNewForm();
    this.passwordForm = this.getNewPasswordForm();
  }

  getNewForm(){
    
    return new FormGroup({
        name: new FormControl(this.user.name,
        [ 
          Validators.required,
          Validators.minLength(3)
        ]),
        username: new FormControl(this.user.username,
        [ 
          Validators.required,
          Validators.minLength(4),
          UsernameValidators.cannotContainSpace
        ]),
        password: new FormControl('', 
        [Validators.required, Validators.minLength(6)]),
        password2: new FormControl('', 
        [Validators.required,]),
      });
  }

  getNewPasswordForm(){
    return new FormGroup({
        password: new FormControl('', 
        [Validators.required, Validators.minLength(6)]),
        password2: new FormControl('', 
        [Validators.required,]),
      });
  }

  isUserFormChangedAndValid(){
    let formValue = this.userForm.value;

    if(this.userForm.invalid){
      
      return false;
    }
    if(formValue.name != this.user.name){
      
      return true;
    }
    if(formValue.username != this.user.username){
      return true;
    }
    return false;
  }

  updateUser(){
    let formValue = this.userForm.value;
    let updatedUser = {}
    updatedUser["_id"] = this.user._id

    if(formValue.name != this.user.name){
      
      updatedUser["name"] = formValue.name;
    }
    if(formValue.username != this.user.username){
      updatedUser["username"] = formValue.username;
    }
    if(formValue.role != this.user.privleges){
      updatedUser["privleges"] = formValue.role;
    }
    this.userService.update(updatedUser);
    this.userService.update(updatedUser).subscribe((user)=> {
      this.userForm = this.getNewForm();
      
    });
  }

  changePassword(){
    
    let formValue = this.passwordForm.value;
    let updatedUser = {}
    updatedUser["_id"] = this.user._id
    updatedUser["password"] = formValue.password;
    this.userService.update(updatedUser).subscribe((user)=> {
      alert("Password change successful. You will be logged out now.");
      this.auth.unauthenticate();
      this.router.navigate(['/login']);
    });
  }
  get password(){
    return this.passwordForm.get('password');
  }

  get password2(){
    return this.passwordForm.get('password2');
  }

  passCheck(){
    return this.password.value == this.password2.value;
  }

  ngOnInit() {
  }

}
