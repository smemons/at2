import { CacheStoreService } from './../../services/cacheStore.service';
import {
  ConfirmationService, SelectItem
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { ActivityService } from './../../services/activity.service';
import { Activity } from './../../models/activity';
import { Component, OnInit } from '@angular/core';
declare var moment: any;

@Component({
  selector: 'app-editActivity',
  templateUrl: './editActivity.component.html',
  styleUrls: ['./editActivity.component.css']
})
export class EditActivityComponent implements OnInit {

  activities: Activity[];
  dialogVisible: boolean = false;
  activity: Activity;
  constructor(private activityService: ActivityService, private cache:CacheStoreService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllActivities()
      .subscribe({

        next: activities => this.activities = activities
      });;
       this.cache.populateAll();
  }
  //get all deptegories
  getAllActivities() {

    return this
      .activityService
      .getAll();
  }

  deleteActivity(activity) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .activityService
            .delete(activity._id)
            .subscribe(data => {
              console.log('Activity deteted - Service!');
              this
                .alertService
                .success('Activity deleted!');

              //remove form  list too
              this.activities.splice(this.findSelectedActivityIndex(activity),1);


            }, error => {
              //this.alertService.error(error);
              console.log(error);
              this
                .alertService
                .error(error);

            });
        }
      });
  }
  editActivity(activity: Activity) {
    this.dialogVisible = true;
     this.activity= activity;
    this.activity.startDate = moment(activity.startDate).toDate();
    this.activity.endDate = moment(activity.endDate).toDate();


  }
  //update Activity
  updateActivity(activities: Activity) {
    this
      .activityService
      .update(activities)
      .subscribe(data => {
        console.log('Activity updated - Service!');
        this
          .alertService
          .success('Activity updated!');
        this.dialogVisible = false;

      }, error => {
        //this.alertService.error(error);
        console.log(error);
        this
          .alertService
          .error(error);
        this.dialogVisible = false;
      });
  }

  //cancel
  cancel() {
    this.dialogVisible = false;
    this.activity = new Activity;
  }
  //get all drop down from cache service
get categories():SelectItem[] {
  return this.cache.categories;
}
get depts():SelectItem[] {
  return this.cache.depts;
}
get statuses():SelectItem[] {
  return this.cache.statuses;
}
get focuses():SelectItem[] {
  return this.cache.focuses;
}
get visibilities():SelectItem[] {
  return this.cache.visibilities;
}
get phases():SelectItem[] {
  return this.cache.phases;
}
get kpis():SelectItem[] {
  return this.cache.kpis;
}
  private findSelectedActivityIndex(activity:Activity): number {
       return this.activities.indexOf(activity);
    }
}

