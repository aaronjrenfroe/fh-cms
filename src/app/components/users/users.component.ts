import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users : [any];
  constructor(private userService: UserService ) { // private router: Router this.router.navigate(['/']);
    userService.getAll((users) => {
      this.users = users;
      console.log('Users',users);
    });
   }

  ngOnInit() {
    // fetch users from db and and set users
  }

  delete(user){
    console.log("Delete user", user);
    let idx = this.users.indexOf(user);
    this.users.splice(idx, 1);
    this.userService.delete(user._id).subscribe(deletedUser => {
      if(deletedUser == user){
        console.log('deleted');
      }
      console.log(deletedUser, user);
      

    },(error)=>{
      console.log(error);
    })
    // remove post from serverside db using postService
  }

  edit(user){
    console.log("Edit user", user);
    
    // remove post from serverside db using postService
  }

  

}
