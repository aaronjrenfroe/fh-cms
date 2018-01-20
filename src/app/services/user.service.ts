import { environment } from './../../environments/environment';
import { AppError } from './../common/app-error';
import { BadInputError } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';


@Injectable()
export class UserService{
  url : string

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl+'/user';
  }

  getAll(callback){
    console.log(this.url);
    
    this.http.get(this.url).subscribe((data) => {
      return callback(data);
    }, (err) => {
      //this.handleError(err);
      alert("could not get users: " + err);
    })
  }
  create(resource){
    return this.http.post( this.url + '/', resource)
      .catch(this.handleError);
  }

  update(resource){
    
    
    return this.http.post(this.url + '/' + resource._id, resource)
      .catch(this.handleError);
  }

  delete(id){
    return this.http.delete(this.url + '/' + id)
      .retry(3)
      .catch(this.handleError);
  }

  private handleError(error: Response){

    if(error.status === 404){
      return Observable.throw(new NotFoundError());
    }else if(error.status === 400){
      return Observable.throw(new BadInputError(error.json));
    }else{
      return Observable.throw(new AppError(error));
    }
  }
  
}