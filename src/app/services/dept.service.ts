import {Dept} from './../models/dept';
import {AuthService} from './auth.service';
import {Response, Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class DeptService {

  constructor(private http : Http, private authService : AuthService) {}

  //create Dept
  create(dept : Dept) {

    dept.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting Dept from service: ' + dept);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/dept', dept)
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// get all Dept
  getAll() {
    return this
      .http
      .get('/api/dept/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update Dept
  update(dept : Dept) {
    dept.createdBy = this
      .authService
      .getCurrentUser();
    console.log('putting/updating Dept from service: ' + dept);

    return this
      .http
      .put('/api/dept', dept)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete dept
  delete(id : String) {
    return this
      .http
      .delete('/api/dept/' + id)
      .map((response : Response) => response);
  }
}
