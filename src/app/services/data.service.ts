import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInputError } from '../common/bad-input';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DataService {

  constructor(private url : string, private http: HttpClient) { }

  getAll(){
    return this.http.get(this.url)
    .catch(this.handleError);
  }

  create(resource){
    return this.http.post( this.url, JSON.stringify(resource))
      
      .catch(this.handleError);
  }

  update(resource){
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({isRead: true}))
    
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
