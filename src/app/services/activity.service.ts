
import { Subject, BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { Activity } from './../models/activity';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityService {



constructor(private authService:AuthService,private http:Http) { }


create(activity:Activity)
{

  activity.createdBy=this.authService.getCurrentUser();
    return this
      .http
      .post('/api/activity', activity)
      .map((response: Response) => response.json());
}

//update Activity
update(activity:Activity)
{

  activity.updatedBy=this.authService.getCurrentUser();
   console.log('putting/updating Activity from service: ' + activity);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .put('/api/activity', activity)
      .map((response: Response) => response);
}
//update Activity Percentage only
updatePercentage(activity:Activity)
{

  activity.updatedBy=this.authService.getCurrentUser();
   console.log('putting/updating Activity from service: ' + activity);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .put('/api/activity/percent', activity)
      .map((response: Response) => response);
}
  //get one activity by id
  getActivity(id)
  {
     return this
      .http
      .get('/api/activity/'+id)
      .map((response: Response) => response.json());
  }

//get all activity
 getAll() {
    return this
      .http
      .get('/api/activity/all')
      .map((response: Response) => response.json());
  }

//get all activity
 getAllInProg(id:string) {
    return this
      .http
      .get('/api/activity/allInProg/'+id)
      .map((response: Response) => response.json());
  }

/**
 *
 * @param id
 */
//get all Category
 getAllByUserId(id:String) {
    return this
      .http
      .get('/api/activity/allByUserId/'+id)
      .map((response: Response) => response.json());
  }
  //get all by userid  activities
   getAllAssigned(userId:String) {

    return this
      .http
      .get('/api/activity/allAssigned/'+userId)
      .map((response: Response) => response.json());
  }
  //get all by created userid  activities
   getAllCreated(userId:String) {
    return this
      .http
      .get('/api/activity/allCreated/'+userId)
      .map((response: Response) => response.json());
  }
  //get all children
   getAllChildrenById(id)
  {
     return this
      .http
      .get('/api/activity/allByParentId/'+id)
      .map((response: Response) => response.json());
  }
//get activities by cat id
getAllByCatId(id)
{
  return this
      .http
      .get('/api/activity/allByCatId/'+id)
      .map((response: Response) => response.json());
}
//get activities by act id
getActivityById(id)
{
  return this
      .http
      .get('/api/activity/byId/'+id)
      .map((response: Response) => response.json());
}
 /////////////////////////////////////////////////////////// delete activity
  delete(id : String) {
    return this
      .http
      .delete('/api/activity/' + id)
      .map((response : Response) => response);
  }
}
