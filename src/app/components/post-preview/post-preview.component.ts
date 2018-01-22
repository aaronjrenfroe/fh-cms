import { PostService } from './../../services/post.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit {

  @Input('post') selectedPost;
  @Input() canEdit; 

  @Output('onButtonPress') buttonPressEmmiter = new EventEmitter();

  allEvents = [] 

  constructor(public postService: PostService) {
    postService.getAllEvents((events) => {
      this.allEvents = events
    });
   }

  ngOnInit() {
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

  onButtonPressed(button){
    this.buttonPressEmmiter.emit(button);
  }

  get visableText(){
    let visableDate = this.selectedPost.Date_Visable;
    let hasEvents = this.selectedPost.Events.length > 0;
    if (visableDate != null){
      if(hasEvents){
        if(visableDate == 0){
          return 'Visable on checkin day';
        }else if(visableDate > 0){
          if(visableDate > 1){
            return `Visable ${visableDate} days after checkin`;
          }
          return `Visable the day after checkin`;
        }else if(visableDate < 0){
          if(visableDate < -1){
            return `Visable ${visableDate* -1} days before checkin`;
          }
          return `Visable the day before checkin`;
        }
      }else if(visableDate > 0){
        let createdMoment = moment(this.selectedPost.Timestamp);
        let visableMoment = createdMoment.add(visableDate,'day');
        let text = createdMoment.from(visableMoment,true);
        return `Visable ${text} after post was created`;
      }
    }else{
      let createdMoment = moment(this.selectedPost.Timestamp);
      
      return `Visable the day the post was created: ${createdMoment.format('MMM D, YYYY')}`;
    }
  }


}
