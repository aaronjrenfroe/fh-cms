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
  constructor(public postService: PostService, public auth: AuthService, public sessionService: SessionService) {
    // consttructor needs PostService to edit posts
    postService.getAll((posts) => {
      this.posts = posts
      this.selectedPost = posts[0];
      
      
      this.updateSearch();
    });
    postService.getAllEvents((events) => {
      this.allEvents = events
    })
   }

  ngOnInit() {
    // get posts from server
    this.sessionService.setRouteObject('edit-post',null);
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

  delete(){
   
    if(confirm("Are you sure to delete post titled "+this.selectedPost.Title)) {
      let idx = this.posts.indexOf(this.selectedPost);
      let deleted_post = this.posts.splice(idx, 1);

      this.postService.delete(deleted_post[0].Post_ID).subscribe((post => {
        this.posts.splice(idx,1);
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

  getEventNameForID(id){
    let event = this.allEvents.filter((event) =>{
      return event.EventID == id;
    });
    if(event.length > 0){
      return event[0].EventName;
    }
    return 'Unknown event with id: ' + id;
  }
  
}
