import { AppError } from './../common/app-error';
import { BadInputError } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';



@Injectable()
export class PostService {
  url: string
  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = 'http://localhost:3000/api/posts';

  }

  getAll(callback) {
    this.http.get(this.url).subscribe((data) => {
      return callback(data);
    }, (err) => {
      // this.handleError(err);
      console.log(err);

    })

  }

  getAllEvents(callback) {
    this.http.get('http://localhost:3000/api/events').subscribe((data) => {
      return callback(data);
    }, (err) => {
      // this.handleError(err);
      console.log(err);
    });
  }

  create(resource) {
    console.log(resource);
    
    let reMapped = {
      Title: resource.title,
      User_ID: this.auth.currentUser._id,
      Excerpt: resource.subject,
      Thumnail_Url: 'http://lorempixel.com/1920/1080',
      Post_Type: resource.bodyType,
      Body: resource.body,
      Date_Visable: resource.offset,
      Expire_Date: resource.expireDate,
      Events: resource.events
    };
    return this.http.post(this.url + '/create', reMapped)
    .catch(this.handleError);
  }

  update(resource){
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({ isRead: true }))

      .catch(this.handleError);
  }

  delete (id){
    return this.http.delete(this.url + '/' + id)
      .retry(3)
      .catch(this.handleError);
  }

  private handleError(error: Response){
    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    } else if (error.status === 400) {
      return Observable.throw(new BadInputError(error.json));
    } else {
      return Observable.throw(new AppError(error));
    }
  }
}