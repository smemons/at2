import { TaskService } from './../services/task.service';
import { UtilityService } from '../services/utility.service';
import { Activity } from './../models/activity';
import { ActivityService } from './../services/activity.service';
import { CacheStoreService } from './../services/cacheStore.service';
import { SelectItem } from 'primeng/primeng';
import { AnalyticsService } from './../services/analytics.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-analytics2',
  templateUrl: './analytics2.component.html',
  styleUrls: ['./analytics2.component.css']
})
export class Analytics2Component implements OnInit {
isDataAvailable:boolean;

statusColor=['#FF3333','#FFCC33','#00CCFF','#66CC66'];
statusData:any=[];
selectedRef:string;
refSelectTitle="Select Reference";
refSelectExpand:boolean;
refActExpand:boolean=true;
refActivities:any=[];
showDetail:boolean;
detailHeading:string="Detail";
tasks:any=[];
selectedActivity:any;
actChildren:any;
actDataAvailable:boolean;

  constructor(private anService:AnalyticsService,private utilityService:UtilityService,
  private cache:CacheStoreService,private activityService:ActivityService, private taskService:TaskService) { }
  ngOnInit() {

    //get all status by ref
    this.anService.getStatusByRef().subscribe(data=>{
    this.statusData=data;
     this.isDataAvailable=true;
    });

    if(this.refList.length==0)
  {
    this.cache.getCategories();
  }
  }
  //get all drop down from cache service
get refList():SelectItem[] {

  return this.cache.categories;
}

setRefRow(item)
{
debugger;
this.selectedRef=item._id.catId[0];
this.refSelectTitle=item._id.catName;
this.refSelectExpand=true;

this.getAllActivitiesByCatId(this.selectedRef);
}
refStatusChanged(evt)
{
  debugger;
  this.getAllActivitiesByCatId(evt.value);
  //this.refSelectTitle=item._id.catName;
  this.refSelectExpand=true;

}
private getAllActivitiesByCatId(id)
{
  this.activityService.getAllByCatId(id).subscribe(data=>{
    this.refActivities=data;
    this.refSelectTitle=data[0].catName;
    this.refActivities.forEach(el => {
         let status=this.utilityService.getComputedStatus(el.startDate,el.endDate,el.percentage);
         el.status=status.replace(" ", "");
      });

    this.refActExpand=false;
  });
}

/**
 * to display detail of the this activity and its  chidren
 * @param id
 */
viewActDetail(act){
debugger;
    this.showDetail=true;
    this.actDataAvailable=false;
    this.anService.getActivityHrchyById(act._id,act.deptId).subscribe(data=>{
      if(data!=null && data.length>0)
      {
    try{
      this.selectedActivity=data[0];
      this.detailHeading=data[0].title;
      if(this.selectedActivity.firstChild!=null && this.selectedActivity.firstChild.length>0)
      {
      //sort array of children
       this.actChildren=this.selectedActivity.children.slice(0);
       this.actChildren.sort((leftSide,rightSide):number=>{
         if(leftSide.level> rightSide.level) return 1;
         if(leftSide.level <  rightSide.level) return -1;
         return 0;
       });
      }
      this.selectedActivity.firstChild=[];
      this.selectedActivity.children=[];
      //set status of all the children
      this.actChildren.forEach(el => {
         let status=this.utilityService.getComputedStatus(el.startDate,el.endDate,el.percentage);
         el.status=status.replace(" ", "");
      });

      console.log(this.actChildren);
    }
      catch(ex)
      {
        console.error(ex);
      }
       this.tasks=[];
        this.taskService.getAllByActivityId(act._id).subscribe(tasks=>{
          this.tasks=tasks;
        });

        this.actDataAvailable=true;
      }
    });
}
/**
 * get the key value pair for phases as  lookup
 * @param id
 */
getPhaseTitleById(id:string)
{
  if(this.utilityService.phaseKeyValues!=null)
  {
      return this.utilityService.phaseKeyValues.get(id);
  }
  else
  {
    this.utilityService.getAllPhases().subscribe(data=>{
      this.utilityService.phaseKeyValues=new Map();
      data.forEach(el => {
        this.utilityService.phaseKeyValues.set(el._id,el.title);
      });
      return this.utilityService.phaseKeyValues.get(id);
    });
  }
  return id;
}
}
