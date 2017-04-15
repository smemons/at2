import { Task } from './../models/task';
import { AlertService } from '../services/alert.service';
import { TaskService } from '../services/task.service';
import { Component, Input,Output, OnInit,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

@Input() activityId:String;

  model: any = {};
  task:Task;
  loading = false;
 @Output()
    taskChanged = new EventEmitter();
  @Output()
    taskClosed = new EventEmitter();
  constructor(private taskService:TaskService,private alertService:AlertService) { }

  ngOnInit() {
  }


  saveTask()
  {

     this.loading=true;
     this.model.activityId=this.activityId;
      event.preventDefault();
      this.taskService.create(this.model).subscribe(
                data => {
                  this.task=new Task();
                   console.log('Task created - Service!');
                    this.alertService.success("Task saved!");
                    //this.taskService.getAllByActivityId(id).subscribe(tasks=>this.tasks=tasks);
                     this.task=data;
                     this.taskChanged.next(this.task);

                },
                error => {

                    console.log(error);
                    this.alertService.error(error._body);
                    this.loading = false;
                });

      this.loading=false;
  }

  close()
  {

     event.preventDefault();
     this.taskClosed.next(true);
  }
}
