import { AuthService } from './../../services/auth.service';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  selectedPost : any;

  constructor(private postService: PostService, private auth: AuthService) {
    // consttructor needs PostService to edit posts
    console.log();
    
    postService.getAll((posts) => {
      this.posts = posts
      this.selectedPost= posts[0];
    });
   }

  ngOnInit() {
    // get posts from server
  }

  delete(){
    console.log("Delete Post", this.selectedPost);
    let idx = this.posts.indexOf(this.selectedPost);
    let deleted_post = this.posts.splice(idx, 1);
    console.log(deleted_post);
    
    this.postService.delete(deleted_post[0].Post_ID).subscribe((post => {
      
    }), error => {
      if(error){
        this.posts. splice(idx, 0, this.selectedPost);
        console.log(error);
        
      }
    })
    // remove post from serverside db using postService
  }

  edit(){
    console.log("Edit Post", this.selectedPost);
    // remove post from serverside db using postService
  }

  postWasClicked(post){
    this.selectedPost = post;
    console.log(post);
  }

}
