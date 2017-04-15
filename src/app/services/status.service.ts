import { Status } from './../models/status';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Subject,BehaviorSubject } from 'rxjs/Rx';
@Injectable()
export class StatusService {

isStatusChanged: Subject<boolean> = new BehaviorSubject(false);
  isLoggedIn$ = this.isStatusChanged.asObservable();
  constructor(private http : Http, private authService : AuthService) {}

  //create Status
  create(status : Status) {

    status.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting Status from service: ' + status);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/status', status)
      .map((response : Response) => response.json());

  }
  ///////////////////////////////////////////////// get all Status
  getAll() {
    return this
      .http
      .get('/api/status/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update Status
  update(status : Status) {
    status.createdBy = this
      .authService
      .getCurrentUser();
    console.log('putting/updating Status from service: ' + status);

    return this
      .http
      .put('/api/status', status)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete status
  delete(id : String) {
    return this
      .http
      .delete('/api/status/' + id)
      .map((response : Response) => response);
  }
}
