import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  selectedPost : any;
  searchTerms = [];
  searchResults = [];
  allEvents : any[] = [];
  users = {};

  constructor(public postService: PostService, public auth: AuthService, public sessionService: SessionService, private userService: UserService) {
    // consttructor needs PostService to edit posts
    postService.getAll((posts) => {
      this.posts = posts
      this.selectedPost = posts[0];
      this.updateSearch();
    });
    
    postService.getAllEvents((events) => {
      this.allEvents = events
    });
    userService.getAll((users => {
      users.forEach(user => {
        this.users[user._id] = user.username;
      });
      
      
    }))
   }

  ngOnInit() {
    // get posts from server
    this.sessionService.setRouteObject('edit-post',null);
  }

  get viewBody(){
    return this.selectedPost.Body.replace('\n', '<br>');
  }

  updateSearch(){
    if(this.searchTerms.length == 0){
      this.searchResults = this.posts;
    }else{
      this.searchResults = this.posts.filter(post => {
        for(let key in post){
          for(let term in this.searchTerms){
            let str = post[key];
            if (str instanceof(Number)){
              str = String(str);
            }
            if(str instanceof(String) || typeof str === "string"){
              if(post[key].toLowerCase().search(this.searchTerms[term]) != -1){
                return true;
              }
            }
          }
        }
        return false;
      }); // end filter
    } 
  }

  // Called by post-preview when button is pressed; 
  editOrDelete($event){
    console.log($event);
    
    switch ($event) {
      case 'edit':
        this.edit();
        break;
      case 'delete':
        this.delete();
        break;
      default:
        break;
   }

  }
  delete(){
   
    if(confirm("Are you sure to delete post titled "+this.selectedPost.Title)) {
      let idx = this.posts.indexOf(this.selectedPost);
      let deleted_post = this.posts.splice(idx, 1);

      this.postService.delete(deleted_post[0].Post_ID).subscribe((post => {
        
        this.selectedPost = null;
      }), error => {
        if(error){
          this.posts. splice(idx, 0, this.selectedPost);
        }
      })
    }
  }

  edit(){
    
    this.sessionService.setRouteObject('edit-post', this.selectedPost);
    // remove post from serverside db using postService
  }

  postWasClicked(post){
    this.selectedPost = post;
  }
  
  searchKeyUp(event){
    let value = event.target.value.toLowerCase();
    this.searchTerms = value.split(' ');
    this.updateSearch();
  }

  

  getMonthYear(timestamp){
    let date = new Date(timestamp);
    let year = date.getFullYear();
    return year;
  }
  
}
