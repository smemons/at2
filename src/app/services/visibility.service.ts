import { Visibility } from './../models/visibility';
import { AuthService } from './auth.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VisibilityService {

constructor(private http : Http, private authService : AuthService) {}

  //create Visibility
  create(visibility : Visibility) {

    visibility.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting Visibility from service: ' + visibility);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/vis', visibility)
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// get all Visibility
  getAll() {
    return this
      .http
      .get('/api/vis/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update Visibility
  update(visibility : Visibility) {
    visibility.updatedBy = this
      .authService
      .getCurrentUser();
    visibility.updatedAt=new Date();
    console.log('putting/updating Visibility from service: ' + visibility);

    return this
      .http
      .put('/api/vis', visibility)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete visibility
  delete(id : String) {
    return this
      .http
      .delete('/api/vis/' + id)
      .map((response : Response) => response);
  }
}
