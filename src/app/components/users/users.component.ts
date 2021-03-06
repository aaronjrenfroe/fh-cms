import { AuthService } from './../../services/auth.service';
import { UsernameValidators } from './../login/Username.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users : [any];
  posts : [any];
  // var to store user when editing
  editingUser;

  form = this.getUserForm();

  passwordForm = this.getPasswordForm();
  

  constructor(public userService: UserService,
     public postService: PostService,
     public auth: AuthService
     ) { // public router: Router this.router.navigate(['/']);

   }

   get passwordIsEmpty(){
     return this.passwordForm.value.password.length > 0;
   }

  ngOnInit() {
    // fetch users from db and and set users
    this.loadPosts();
    this.loadUsers();
  }

  loadPosts(){
    this.postService.getAll((posts)=> { 
      this.posts = posts;
      
    })
  }

  loadUsers(){
    this.userService.getAll((users) => {
      this.users = users;
      
    });
  }

  getUserForm(){
    return new FormGroup({
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
      role: new FormControl('')
    });
  }

  getPasswordForm(){
    return new FormGroup({
      password: new FormControl('', 
      [Validators.minLength(6)])
    });
  }

  delete(){
    let user = this.editingUser;
    let idx = this.users.indexOf(user);
    this.users.splice(idx, 1);
    this.userService.delete(user._id).subscribe(deletedUser => {
      if(deletedUser == user){
        alert("Deleted User: " + user.username);
      }

    },(error)=>{
      alert("Error deleted user: " + error);
    })
    // remove post from serverside db using postService
  }

  edit(user){
    
    this.form.controls['name'].setValue(user.name);
    this.form.controls['username'].setValue(user.username);
    this.form.controls['role'].setValue(user.privleges);

    if(this.editingUser){
      
      let updatedName = this.form.value.name;
      let updatedUsername = this.form.value.username;
      let updatedRole = this.form.value.role;

    }
    this.editingUser = user;

  }

  updateUser(){
    let formValue = this.form.value;
    let updatedUser = {}
    updatedUser["_id"] = this.editingUser._id

    if(formValue.name != this.editingUser.name){
      
      updatedUser["name"] = formValue.name;
    }
    if(formValue.username != this.editingUser.username){
      updatedUser["username"] = formValue.username;
    }
    if(formValue.role != this.editingUser.privleges){
      updatedUser["privleges"] = formValue.role;
    }
    this.userService.update(updatedUser);
    this.userService.update(updatedUser).subscribe((user)=> {
      this.loadUsers();
      
    });
    
  }

  resetPassword(){
    let formValue = this.passwordForm.value;
    let updatedUser = {}
    updatedUser["_id"] = this.editingUser._id
    updatedUser["password"] = formValue.password;
    
    this.userService.update(updatedUser).subscribe((user)=> {
      this.loadUsers();
    });
    this.passwordForm = this.getPasswordForm();
  }

  isUserFormChangedAndValid(){
    let formValue = this.form.value;

    if(this.form.invalid){
      
      return false;
    }
    if(formValue.name != this.editingUser.name){
      
      return true;
    }
    if(formValue.username != this.editingUser.username){
      
      return true;
    }
    if(formValue.role != this.editingUser.privleges){
      
      return true;
    }

    return false;
  }

}
