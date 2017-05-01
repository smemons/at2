import { MiniActivity } from './../../models/miniActivity';
import { CacheStoreService } from '../../services/cacheStore.service';
import { StatusService } from './../../services/status.service';
import { Status } from './../../models/status';
import { UtilityService } from './../../services/utility.service';
import { ActivityService } from './../../services/activity.service';
import { AlertService } from './../../services/alert.service';
import { Userservice } from './../../services/userservice.service';
import { Category } from './../../models/category';
import { User } from './../../models/user';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {SelectItem} from 'primeng/primeng';
declare var moment: any;
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit,AfterViewInit {
      model : any = {};
      loading = false;
      users : User[];
      foundUsers : SelectItem[];
      isChild : boolean;
      parentTitle : string;
      category : string;
     // categories : SelectItem[]=[];
      status : string;
     // statuses : SelectItem[]=[];
      focus : string;
      //focuses : SelectItem[];
      dept : string[];
      //depts : SelectItem[];
      phase : string;
      //phases : SelectItem[];
      visibility : string[];
      //visibilities : SelectItem[];
      minDate:Date;
      maxDate:Date;
      level:number=0;
      phaseDisable:boolean;
      catDisable:boolean;
  constructor(
              private utilityService:UtilityService,
              private alertService:AlertService,
              private activityService:ActivityService,
              private cache:CacheStoreService,
              private router:Router,
             ) { }
ngAfterViewInit()
{
}
  ngOnInit() {
   //check if request is coming for a child activity to be created
   let parentUrl=this.router.url;
   this.isChild=false;
   if(parentUrl==='/addChildActivity')
   {
      let act=this.utilityService.getPassedActivity();
      debugger;
      this.model.startDate = moment(act.startDate).toDate();
      this.model.endDate = moment(act.endDate).toDate();
      this.model.parentId=act._id;
      this.parentTitle =  act.title;
      this.model.title="";
      this.model.desc="";
      this.isChild=true;
      this.model._id=undefined;
      this.model.level=act.level+1;
      this.level=this.model.level;
      //set min max date
      this.minDate=this.model.startDate;
      this.maxDate=this.model.endDate;
      this.catDisable=true;
      if(this.level>1)
      {
        this.model.phaseId=act.phaseId;
        this.phaseDisable=true;
      }
      this.model.deptId=act.deptId;
      this.model.assignee=act.assignee;
      this.model.catId=act.catId;
      this.model.statusId=act.statusId;
      this.model.percentage=act.percentage;
   }
   this.cache.populateAll();
   this.loadUsers();
    // //get users
    // this.utilityService.getAllUsers().subscribe(users=>{
    //  users.forEach(usr => {
    //    this.foundUsers.push({label:usr.username, value:usr.username});
    //  });
    // });
  }
  createActivity(){
   //validate that date is correctly entered.
   let startDate=moment(this.model.startDate);
   let endDate=moment(this.model.endDate);
  if(startDate>=endDate)
  {
    this.alertService.error('Invalid Date');
    return false;
  }
        this.loading = true;
         this.activityService.create(this.model)
            .subscribe(
                data => {
                   this.alertService.success('Activty created!');
                   let mini=new MiniActivity();
                                mini._id=data._id;
                                mini.assignee=data.assignee;
                                mini.endDate=data.endDate;
                                mini.startDate=data.startDate;
                                mini.title=data.title;
                                mini.percentage=data.percentage;
                                mini.createdBy=data.createdBy;
                   this.cache.isActivityCreated.next(mini);
                   // this.router.navigate(['/home']);
                   this.viewActivity(data._id);
                },
                error => {
                    //this.alertService.error(error);
                    console.log(error._body);
                    this.alertService.error(error._body);
                    this.loading = false;
                });
  }
//typeahead feature needed by input box
//for searching of users
  searchTypeAheadUsers(event)
  {
   this.foundUsers=[];
    this.utilityService.getUsersTypeAhead(event.query).subscribe(data => {
            data.forEach(usr => {
              this.foundUsers.push(usr.username);
            });
  },error=>{
    console.log(error);
  });
}
//viewActivity
viewActivity(id:String)
{
  this.utilityService.viewActivity(id);
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
private loadUsers() {
       // //get users
    if(this.foundUsers==null || this.foundUsers.length==0)
    {
        this.foundUsers=[];
        this.utilityService.getAllUsers().subscribe(users=>{
        users.forEach(usr => {
          this.foundUsers.push({label:usr.username, value:usr.username});
        });
        });
    }
    }
}
