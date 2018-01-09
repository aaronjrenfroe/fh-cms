import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {

  routeObjects = {}
  constructor() { }

  setRouteObject(key,object){
    this.routeObjects[key] = object
  }

  getRouteObject(key){
    return this.routeObjects[key]
  }

}
