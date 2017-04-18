import { KPI } from './../models/kpi';
import { AuthService } from './auth.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class KpiService {
  constructor(private http : Http, private authService : AuthService) {}
//create KPI
  create(kpi : KPI) {

    kpi.createdBy = this
      .authService
      .getCurrentUser();
    console.log('posting KPI from service: ' + kpi);
       return  this.http.post('/api/kpi', kpi).map((response : Response) => response.json());
    //return this.http.post('/api/kpi', kpi).map((response : Response) => response.json());

  }
  ///////////////////////////////////////////////// get all KPI
  getAll() {
    return this
      .http
      .get('/api/kpi/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// update KPI
  update(kpi : KPI) {
    kpi.createdBy = this
      .authService
      .getCurrentUser();
    console.log('putting/updating KPI from service: ' + kpi);

    return this
      .http
      .put('/api/kpi', kpi)
      .map((response : Response) => response);
  }
  /////////////////////////////////////////////////////////// delete kpi
  delete(id : String) {
    return this
      .http
      .delete('/api/kpi/' + id)
      .map((response : Response) => response);
  }
}
