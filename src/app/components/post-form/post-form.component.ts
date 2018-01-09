import { PostService } from './../../services/post.service';
import { Component, OnInit, Inject,Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { TreeviewItem, TreeviewComponent, TreeviewConfig } from 'ngx-treeview';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  @Input('post') postToEdit;
  @Input('is-editing') isEditing;

  form: FormGroup;

  titleLengthLimit = 23;
  subjectLengthLimit = 200;
  bodyLengthLimit = 10000;
  submitButtonText = 'create'

  goodPostCreation = false;
  badPostCreation = false;
  selectedEvents: number[];
  totalNumberOfEvents = 0;
  constructor(@Inject(FormBuilder) fb: FormBuilder, private postService: PostService ){

    if(this.isEditing){
      this.submitButtonText = 'update';
    }


    this.form = fb.group({
      title: ['', Validators.required],// Finish this.
      subject: ['', Validators.required],
      bodyType: [''],
      body:['', Validators.required],
      offset: [''],
      expireDate: [''],
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

  }

  createPost(){
    this.form.value.events = (this.selectedEvents.length == this.totalNumberOfEvents) ? [] : this.selectedEvents;
    this.postService.create( this.form.value).subscribe((good) => {
      this.goodPostCreation = true;
      this.badPostCreation = false;
      // if good
      // navigtate back to post page
    }, (err) => {
      this.badPostCreation = true
      this.goodPostCreation = false;
    })
  }

}
