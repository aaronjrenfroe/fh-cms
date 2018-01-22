import { SessionService } from './../../services/session.service';
import { PostService } from './../../services/post.service';
import { Component, OnInit, Inject,Input, Output } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { TreeviewItem, TreeviewComponent, TreeviewConfig } from 'ngx-treeview';
import { Params, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  postToEdit;
  isEditing;

  form: FormGroup;

  titleLengthLimit = 23;
  subjectLengthLimit = 200;
  bodyLengthLimit = 10000;
  submitButtonText = 'create'

  goodPostCreation = false;
  badPostCreation = false;
  selectedEvents: number[];
  totalNumberOfEvents = 0;
  form_image;
  constructor(@Inject(FormBuilder) public fb: FormBuilder,
                                  public postService: PostService,
                                  public sessionService: SessionService,
                                  public activatedRoute: ActivatedRoute,
                                  public location: Location){
    this.initForm(this.fb);
  }

  initForm(fb){
    this.form = fb.group({
      title: [this.isEditing ? this.postToEdit.Title : '', Validators.required],// Finish this.
      subject: [this.isEditing ? this.postToEdit.Excerpt : '', Validators.required],
      image: [this.isEditing ? this.postToEdit.Thumbnail : '', Validators.required],
      bodyType: [this.isEditing ? this.postToEdit.Post_Type : '', Validators.required],
      body:[this.isEditing ? this.postToEdit.Body : '', Validators.required],
      offset: [this.isEditing ? this.postToEdit.Date_Visable : '' ],
      expireDate: [this.isEditing ? this.postToEdit.Expire_Date : ''],
    });
  }

  get title(){
    return this.form.get('title');
  }
  get subject(){
    return this.form.get('subject');
  }

  get bodyType(){
    return this.form.get('bodyType');
  }

  get body(){
    return this.form.get('body');
  }

  get offset(){
    return this.form.get('offset');
  }

  get expireDate(){
    return this.form.get('expireDate');
  }
  
  onKeyDown(event){

  }

  onSelectedChange(events){
    this.selectedEvents = events.selected;
    this.totalNumberOfEvents = events.total;
  }

  ngOnInit() {
    
    let path = this.activatedRoute.routeConfig.path;
    
    if(path.search('edit/:id')!= -1){
      this.postToEdit = this.sessionService.getRouteObject('edit-post');
      this.isEditing = true
      this.submitButtonText = 'update';
      // if ! post get post from server or cache
      if(!this.postToEdit){
        this.activatedRoute.params.subscribe((params: Params) => {
          let postId = params['id'];
          this.postService.getPost(postId, (data) => {
            this.postToEdit = data;
            this.initForm(this.fb);
          })
        });
      }else{
        this.initForm(this.fb);
      }
    }else{
      this.initForm(this.fb);
    }
  }

  onFileChange(event) {
    if(event.target.files && event.target.files.length > 0) {
      this.form_image = event.target.files[0];
    }
  }
  

  async createPost(){
    
    this.form.value.events = (this.selectedEvents.length == this.totalNumberOfEvents) ? [] : this.selectedEvents.map((event : any) => { return event.eventId});
    let allEventTags = this.selectedEvents.map((event: any) => {
      return event.tags;
    });
    
    let tagStr = ''
    for(let singleTag in allEventTags){
      let splitTags = allEventTags[singleTag].split(' ')
      
      for(let wordIndx in splitTags){
        let lcw = splitTags[wordIndx].toLowerCase();
        if(tagStr.search(lcw) == -1){
          tagStr += lcw + ' ';
        }
      }
    }

    let formValue = this.form.value;
    formValue.tags = tagStr;
    if(this.form_image){
      let url = await this.postService.uploadImage(this.form_image)
      formValue.image = url;
    }
    // Bound Event Count Confirmation
    let eventCountBelowThreshold = this.selectedEvents.length < 20 && this.selectedEvents.length > 0;
    let eventCountText = this.selectedEvents.length > 0 ? this.selectedEvents.length : 'all';
    if(eventCountBelowThreshold || confirm("Confirm you would like to bind this post to "+eventCountText+" events")){
          // Update
      if(this.isEditing) {
        if(formValue.image == null){
          formValue.image = this.postToEdit.Thumnail_URL;
        }
        
        
        let data = { 
          newPost: formValue,
          oldPost: this.postToEdit
        }
        
        
        this.postService.update(data).subscribe((good) => {
          this.goodPostCreation = true;
          this.badPostCreation = false;
          // if good
          // navigtate back to post page
          this.location.back();
        }, (err) => {
          this.badPostCreation = true
          this.goodPostCreation = false;
        })
        
      }else{ // Create
        this.postService.create(formValue).subscribe((good) => {
          this.goodPostCreation = true;
          this.badPostCreation = false;
          this.location.back();
          // if good
          // navigtate back to post page
        }, (err) => {
          this.badPostCreation = true
          this.goodPostCreation = false;
        })

      }
    }
  }

}
