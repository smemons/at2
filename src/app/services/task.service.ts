import { Response, Http } from '@angular/http';
import { Task } from './../models/task';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TaskService {

constructor(private http:Http,private authService: AuthService) { }

create(task:Task)
{

  task.createdBy=this.authService.getCurrentUser();
   console.log('posting task from service: ' + task);

    return this
      .http
      .post('/api/task', task)
      .map((response: Response) => response.json());
}
//get all Category
 getAll() {
    return this
      .http
      .get('/api/task/all')
      .map((response: Response) => response.json());
  }
  //get all Category
 getAllByActivityId(id:String) {
    return this
      .http
      .get('/api/task/allByActivity/'+id)
      .map((response: Response) => response.json());
  }

}
