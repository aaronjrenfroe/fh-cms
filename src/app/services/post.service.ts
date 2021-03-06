import { environment } from './../../environments/environment';
import { AppError } from './../common/app-error';
import { BadInputError } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import { resolve } from 'q';



@Injectable()
export class PostService {
  url: string
  eventsData : any;
  eventsLastUpdateTime = 0;

  constructor(private http: HttpClient, private auth: AuthService) {

    this.url = environment.apiUrl;
  }

  getPost(id, callback){
    this.http.get(this.url + '/posts/' + id).subscribe((data) => {
      return callback(data);
    }, (err) => {
      // this.handleError(err);
      alert("Could not get post with id " + id + err);
    });
  }

  getAll(callback) {
    this.http.get(this.url + '/posts').subscribe((data) => {
      return callback(data);
    }, (err) => {
      // this.handleError(err);
      alert("Could not get posts: " + err);
    })

  }

  getAllEvents(callback) {
    if(this.eventsLastUpdateTime + 600000 > Date.now()){
      callback(this.eventsData)
    }
    this.http.get(this.url+'/events').subscribe((data) => {
      this.eventsLastUpdateTime = Date.now();
      this.eventsData = data;
      return callback(data);
    }, (err) => {
      // this.handleError(err);
      alert("Could not get events: " + err);
    });
  }

  uploadImage(file){
    
    
    return new Promise((resolve, reject) => {
      this.http.get(this.url+`/image/sign-s3?file-name=${file.name}&file-type=${file.type}`).subscribe(async (res: any) => {

        let url = await this.uploadFile(file, res.signedRequest, res.url);
        
        resolve(url);
      }, err => {
        
        reject(err);
      });
    });
  }

  private uploadFile(file, signedRequest, url){
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            resolve(url);
          }
          else{
            reject({ response: xhr});
          }
        }
      };
      
      xhr.send(file);
    });
  }

  create(resource) {
  
    // then when we have an image url upload image

    let reMapped = {
      Title: resource.title,
      User_ID: this.auth.currentUser._id,
      Excerpt: resource.subject,
      Thumnail_URL: resource.image,
      Post_Type: resource.bodyType,
      Body: resource.body,
      Date_Visable: resource.offset,
      Expire_Date: resource.expireDate,
      Events: resource.events
    };
    return this.http.post(this.url + '/posts/create', reMapped)
    .catch(this.handleError);
  }

  update(resource){
    return this.http.post(this.url + '/posts/update/' + resource.oldPost.Post_ID,resource)

      .catch(this.handleError);
  }

  delete (id){
    return this.http.delete(this.url + '/posts/' + id)
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