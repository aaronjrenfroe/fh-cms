import { AppError } from './../common/app-error';
import { BadInputError } from './../common/bad-input';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthService {

  private apiUri = environment.apiUrl;

  constructor(private http: HttpClient) {
    
  }

  get token() {
    return localStorage.getItem('token');
  } 

  login(credentials) {

    let fullurl = this.apiUri + '/user/login';

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
    });
  }

  logout() {
    
    let fullurl = this.apiUri + '/user/me/';
    this.unauthenticate();
    return this.http.delete(fullurl, {
      observe: 'response'  // getting full response with headers 
    });
    
  }

  unauthenticate(){
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    
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

