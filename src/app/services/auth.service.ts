import { AppError } from './../common/app-error';
import { BadInputError } from './../common/bad-input';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {

  private apiUri = "http://localhost:3000";

  constructor(private http: HttpClient) {
    
  }

  get token() {
    return localStorage.getItem('token');
  } 

  login(credentials) {

    let fullurl = this.apiUri + '/api/user/login';

    return this.http.post(fullurl, credentials, 
      {observe: 'response'}).map(data => {  // getting full response with headers 
        let token = data.headers.get('x-auth');
        let result = data.body;
        // Auth was good
        if(result && token){
          
          localStorage.setItem("token", token);
          
          return true;
        }else{
          return false;
        }
    }).catch((err: any, caught) => {
      // what do I return here so returns the same value as this 

      // Doesn't work : core.js:1427 ERROR TypeError: Cannot read property 'subscribe' of undefined
       return Observable.create(false); 

      // Doesn't work : core.js:1427 ERROR TypeError: Cannot read property 'subscribe' of undefined
      // let obsv : Observable<boolean> = Observable.create(false);
      // return obsv.map( () => {
      //   return false;
      // });
    });
  }

  logout() {
    let fullurl = this.apiUri + '/api/user/me/';
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    return this.http.delete(fullurl, {
      observe: 'response'  // getting full response with headers 
    });
    
  }


  get currentUser() {
    const token = localStorage.getItem('token');
    if(!token){
      return false;
    }
    const jwtHelper = new JwtHelper();
    const user = jwtHelper.decodeToken(token);
    return user;
  }

  private handleError(error: Response){
    if(error.status === 400){
      return Observable.throw(new BadInputError(error.json));
    }else{
      return Observable.throw(new AppError(error));
    }
  }
}

