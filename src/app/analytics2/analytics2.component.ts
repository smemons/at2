import { element } from 'protractor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MiniActivity } from './../models/miniActivity';
import { statsModel } from './../models/statsModel';
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
statusData:any=[];
selectedRef:string;
refSelectTitle="Select Reference";
deptSelectTitle="By Organization"
refSelectExpand:boolean;
refActExpand:boolean=true;
refActivities:any=[];

showDetail:boolean;
detailHeading:string="Detail";
tasks:any=[];
selectedActivity:any;
actChildren:any;
actDataAvailable:boolean;
deptStatsModel:statsModel[]=[];
catStatsModel:statsModel[]=[];
scopingBucket:any=[];
designBucket:any=[];
implementBucket:any=[];
private activityListChanged = new BehaviorSubject<string>("");
  constructor(private anService:AnalyticsService,private utilityService:UtilityService,
  private cache:CacheStoreService,private activityService:ActivityService, private taskService:TaskService) { }
  ngOnInit() {
   this.utilityService.getAllPhases().subscribe(data=>{
     debugger;
      this.utilityService.phaseKeyValues=new Map();
      data.forEach(el => {
        this.utilityService.phaseKeyValues.set(el._id,el.title);
      });
    });
    //get all status by ref
    this.anService.getStatusByRef().subscribe(data=>{
    this.statusData=data;
     this.isDataAvailable=true;
    });
    if(this.refList.length==0)
    {
      this.cache.getCategories();
    }
    //populate stats panel with group by dept and calculate all children for overdue, needatt etc
    this.populateGrByDeptStats();
     //populate stats panel with group by cat and calculate all children for overdue, needatt etc
    this.populateGrByCatStats();
    this.activityListChanged.subscribe(data=>{
      this.filterStatsFromActRes(data);
    });
  }
 private  filterStatsFromActRes(stats)
 {

   if(this.refActivities.length>0)
   {
        if(stats!="all")
        {
          let tempArray:any=[];
          this.refActivities.forEach(el => {
            if(el.stats==stats)
            {
              tempArray.push(el);
            }
          });
          this.refActivities=tempArray;
        }
   }
 }
  //get all drop down from cache service
get refList():SelectItem[] {
  return this.cache.categories;
}
/**
 *
 * click on the link of tables for stats and decide what to do with it.
 */
setActivitiesData(item,statsType?:string,actionType?:string)
{
  debugger;
  if(actionType=="CAT")
  {
    this.selectedRef=item.catId;
    this.refSelectTitle=item.catName;
    this.refSelectExpand=true;
    this.getAllActivitiesByCatId(this.selectedRef,statsType);
  }
  if(actionType=="DPT")
  {
    let deptId=item.deptId;
    this.deptSelectTitle=item.deptName;
    this.refSelectExpand=true;
    this.getAllActivitiesByDeptId(deptId,statsType);
  }
}
refStatusChanged(evt)
{
  debugger;
  this.getAllActivitiesByCatId(evt.value,"all");

  this.refSelectExpand=true;

  //change the stats by orgs panel
  this.populateGrByDeptStats(evt.value);
}
private getAllActivitiesByDeptId(id,statsType?:string)
{
  this.anService.getActsGrByDept(id).subscribe(data=>{
    this.refActivities=[];
     data.forEach(el => {
      this.calcEachActivity(el);
     });
     this.activityListChanged.next(statsType);
    this.refActExpand=false;
  });
}
/**
 * get all activities by cat Id
 * use filter if provided
 * @param id
 * @param statsType
 */
private getAllActivitiesByCatId(id,statsType?:string)
{
  this.anService.getActsGrByCat(id).subscribe(data=>{
    this.refActivities=[];
     data.forEach(el => {
      this.calcEachActivity(el);
     });
    this.refActExpand=false;
    this.activityListChanged.next(statsType);
  });
}
/**
 * this method is used to set a line in activity panel.
 * @param el
 */
private calcEachActivity(el)
{
   let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
          //now go through field array
           el.fields.forEach(field => {
           let act:MiniActivity=new MiniActivity();
           act._id=field._id;
           act.title=field.title;
           act.startDate=field.startDate;
           act.endDate=field.endDate;
           act.percentage=field.percentage;
           act.deptName=field.dept.title;
           act.deptId=field.dept._id;
              //each field item may have many activities under and each may have childen
             let tempModel=this.utilityService.findStatsInChildren(field);
             model.overDue+=tempModel.overDue>0?1:0;
             model.needAtt+=tempModel.needAtt>0?1:0;
             model.inProg+=tempModel.inProg>0?1:0;
             model.complete+=tempModel.complete>0?1:0;
             // TODO temporary logic
             if(model.overDue>0)act.stats="OD";
             else
             if(model.needAtt>0)act.stats="NA";
             else
             if(model.inProg>0)act.stats="IP";
             else
             if(model.complete>0)act.stats="CP";
          this.refActivities.push(act);

        });

}
/**
 * to display detail of the this activity and its  chidren
 * @param id
 */
viewActDetail(act){
  debugger;
    this.scopingBucket=[];
    this.implementBucket=[];
    this.designBucket=[];
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
        //sort all the children if any
        if(this.selectedActivity.children.length>1)
        {
          this.selectedActivity.children.sort((leftSide,rightSide):number=>{
         if(leftSide.level> rightSide.level) return 1;
         if(leftSide.level <  rightSide.level) return -1;
         return 0;
       });
        }
        this.selectedActivity.firstChild.forEach(child => {
           let stats=this.utilityService.getComputedStatus(child.startDate,child.endDate,child.percentage);
               child.stats=stats;
          this.placeInBucket(child);
        });
        //check the rest of children and and add them in
        if (this.selectedActivity.children!=null && this.selectedActivity.children.length>0)
        {
          this.selectedActivity.children.forEach(child => {
            //if it is on level 1 dont add it
            if(child.level>1)
            {
              let stats=this.utilityService.getComputedStatus(child.startDate,child.endDate,child.percentage);
               child.stats=stats;
              this.placeInBucket(child);
            }
          });
        }
      }
      this.selectedActivity.firstChild=[];
      this.selectedActivity.children=[];
    }
      catch(ex)
      {
        console.error(ex);
      }
      this.viewTask(act._id);

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
  return id;
}
private populateGrByDeptStats(catId?: string)
{
  this.deptStatsModel=[];
  let id=catId==null?"all":catId;

   this.anService.getActsGrByDept(id).subscribe(data=>{
     data.forEach(el => {
       let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
       model.deptId=el._id.deptId;
       model.deptName=el._id.deptName;
          //now go through field array
          el.fields.forEach(field => {
              //each field item may have many activities under and each may have childen
             let tempModel=this.utilityService.findStatsInChildren(field);
             model.overDue+=tempModel.overDue>0?1:0;
             model.needAtt+=tempModel.needAtt>0?1:0;
             model.inProg+=tempModel.inProg>0?1:0;
             model.complete+=tempModel.complete>0?1:0;
          });
      this.deptStatsModel.push(model);
     });
   });
}
private populateGrByCatStats()
{
   this.catStatsModel=[];
   this.anService.getActsGrByCat("all").subscribe(data=>{
     data.forEach(el => {
       let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
       model.catId=el._id.catId;
       model.catName=el._id.catName;
          //now go through field array
          el.fields.forEach(field => {
              //each field item may have many activities under and each may have childen
             let tempModel=this.utilityService.findStatsInChildren(field);
             model.overDue+=tempModel.overDue>0?1:0;
             model.needAtt+=tempModel.needAtt>0?1:0;
             model.inProg+=tempModel.inProg>0?1:0;
             model.complete+=tempModel.complete>0?1:0;
          });
      this.catStatsModel.push(model);
     });
   });
}
private placeInBucket(child:any)
{
  let phase=this.getPhaseTitleById(child.phaseId);
  if(phase=="Scoping")
  {
     this.scopingBucket.push(child);
  }
  if(phase=="Design")
  {
    this.designBucket.push(child);
  }
  if(phase=="Implementation")
  {
    this.implementBucket.push(child);
  }

}
viewTask(id)
{
  this.tasks=[];
        this.taskService.getAllByActivityId(id).subscribe(tasks=>{
          this.tasks=tasks;
        });
}
}
