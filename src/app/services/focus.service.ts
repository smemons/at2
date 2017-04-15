import { Focus } from './../models/focus';
import { AuthService } from './auth.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FocusService {

 constructor(private http : Http, private authService : AuthService) {}

  //create Focus
  create(focus : Focus) {

    focus.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting Focus from service: ' + focus);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/focus', focus)
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// get all Focus
  getAll() {
    return this
      .http
      .get('/api/focus/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update Focus
  update(focus : Focus) {
    focus.createdBy = this
      .authService
      .getCurrentUser();
    console.log('putting/updating Focus from service: ' + focus);

    return this
      .http
      .put('/api/focus', focus)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete focus
  delete(id : String) {
    return this
      .http
      .delete('/api/focus/' + id)
      .map((response : Response) => response);
  }
}
