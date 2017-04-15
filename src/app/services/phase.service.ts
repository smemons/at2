import { Phase } from './../models/phase';
import { AuthService } from './auth.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PhaseService {

constructor(private http : Http, private authService : AuthService) {}

  //create Phase
  create(phase : Phase) {

    phase.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting Phase from service: ' + phase);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/phase', phase)
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// get all Phase
  getAll() {
    return this
      .http
      .get('/api/phase/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update Phase
  update(phase : Phase) {
    phase.createdBy = this
      .authService
      .getCurrentUser();
    console.log('putting/updating Phase from service: ' + phase);

    return this
      .http
      .put('/api/phase', phase)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete phase
  delete(id : String) {
    return this
      .http
      .delete('/api/phase/' + id)
      .map((response : Response) => response);
  }
}
