
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
phasesBucket:any=[];
selectedAct:string="";
selectedDept:string="";
private activityListChanged = new BehaviorSubject<string>("");
  constructor(private anService:AnalyticsService,private utilityService:UtilityService,
  private cache:CacheStoreService,private activityService:ActivityService, private taskService:TaskService) { }
  ngOnInit() {
   this.utilityService.getAllPhases().subscribe(data=>{
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
    // this.activityListChanged.subscribe(data=>{
    //   this.filterStatsFromActRes(data);
    // });
  }
//  private  filterStatsFromActRes(stats)
//  {

//    if(this.refActivities.length>0)
//    {
//         if(stats!="all")
//         {
//           let tempArray:any=[];
//           this.refActivities.forEach(el => {
//             if(el.stats==stats)
//             {
//               tempArray.push(el);
//             }
//           });
//           this.refActivities=tempArray;
//         }
//    }
//  }
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
   let actIds=[];

    if(statsType=="OD")//if over due
    {
      actIds=item.ODactId;
    }
     if(statsType=="NA")//if over due
    {
      actIds=item.NAactId;

    }
     if(statsType=="IP")//if over due
    {
      actIds=item.IPactId;

    }
     if(statsType=="CP")//if over due
    {
      actIds=item.CPactId;

    }
    if(statsType!="all" && (actIds==null || actIds.length==0))
    {
      this.refActivities=[];
      return false;//dont do any thing just return empty handed.
    }

    this.refSelectExpand=true;
  if(actionType=="CAT")
  {
    this.selectedRef=item.catId;
    this.refSelectTitle=item.catName;
    this.selectedAct=" - "+item.catName;
    this.selectedDept="";
    this.getAllActivitiesByCatId(this.selectedRef,actIds,statsType);
  }
  if(actionType=="DPT")
  {
    let deptId=item.deptId;
    this.deptSelectTitle=item.deptName;
    this.selectedDept=" - "+item.deptName;
    this.getAllActivitiesByDeptId(deptId,actIds,statsType);
  }
}
refStatusChanged(evt)
{

  this.getAllActivitiesByCatId(evt.value,"all");
  this.refSelectExpand=true;

  //change the stats by orgs panel
  this.populateGrByDeptStats(evt.value);
}
private getAllActivitiesByDeptId(id,actIds:any,statsType?:string)
{
  this.anService.getActsGrByDept(id,"dept").subscribe(data=>{
    this.refActivities=[];
     data.forEach(el => {
       if(statsType!="all")
          this.calcEachActivity(el,actIds);
        else
          this.calcEachActivity(el);

     });
    // this.activityListChanged.next(statsType);
    this.refActExpand=false;
  });
}
/**
 * get all activities by cat Id
 * use filter if provided
 * @param id
 * @param statsType
 */
private getAllActivitiesByCatId(id:string,actIds:any,statsType?:string)
{
  this.anService.getActsGrByCat(id).subscribe(data=>{
    this.refActivities=[];

     data.forEach(el => {
        if(id!="all")
          this.calcEachActivity(el,actIds);
        else
          this.calcEachActivity(el);

     });
    this.refActExpand=false;
   // this.activityListChanged.next(statsType);
  });
}
/**
 * this method is used to set a line in activity panel.
 * @param el
 */
private calcEachActivity(el,actIds?:any)
{

   let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
          //now go through field array
           el.fields.forEach(field => {
         if(actIds==null || actIds.length==0)
         {
           this.calcEach(field, model);
         }
         else
        if(actIds.indexOf(field._id)>=0)
        {
          this.calcEach(field, model);
        }
        });
}
calcEach(field,model)
{
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
             if(tempModel.overDue>0)act.stats="OD";
             else
             if(tempModel.needAtt>0)act.stats="NA";
             else
             if(tempModel.inProg>0)act.stats="IP";
             else
             if(tempModel.complete>0)act.stats="CP";

             this.refActivities.push(act);
}
/**
 * to display detail of the this activity and its  chidren
 * @param id
 */
viewActDetail(act){

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
      this.phasesBucket=this.scopingBucket.concat(this.designBucket,this.implementBucket);
      console.log(this.phasesBucket);
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
   this.anService.getActsGrByDept(id,"cat").subscribe(data=>{
     data.forEach(el => {
       let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
       model.CPactId=[];
       model.IPactId=[];
       model.NAactId=[];
       model.ODactId=[];
       model.deptId=el._id.deptId;
       model.deptName=el._id.deptName;
          //now go through field array
          el.fields.forEach(field => {
              //each field item may have many activities under and each may have childen
             let tempModel=this.utilityService.findStatsInChildren(field);
             if(tempModel.overDue>0)
             {
              model.overDue++;
              model.ODactId.push(tempModel.actId);
             }
             else
             if(tempModel.needAtt>0)
             {
              model.needAtt++;
              model.NAactId.push(tempModel.actId);
             }
             else
             if(tempModel.inProg>0)
             {
              model.inProg++;
              model.IPactId.push(tempModel.actId);
             }
             else
             if(tempModel.complete>0)
             {
              model.complete++;
              model.CPactId.push(tempModel.actId);
             }
          });
      this.deptStatsModel.push(model);
     });
   });
}
private populateGrByCatStats()
{
   this.catStatsModel=[];
   this.anService.getActsGrByCat("all").subscribe(data=>{
     debugger;
     data.forEach(el => {
       let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
       model.catId=el._id.catId;
       model.catName=el._id.catName;
       model.CPactId=[];
       model.IPactId=[];
       model.NAactId=[];
       model.ODactId=[];
          //now go through field array
          el.fields.forEach(field => {
              //each field item may have many activities under and each may have childen
             let tempModel=this.utilityService.findStatsInChildren(field);
             if(tempModel.overDue>0)
             {
              model.overDue++;
              model.ODactId.push(tempModel.actId);
             }
             else
             if(tempModel.needAtt>0)
             {
              model.needAtt++;
              model.NAactId.push(tempModel.actId);
             }
             else
             if(tempModel.inProg>0)
             {
              model.inProg++;
              model.IPactId.push(tempModel.actId);
             }
             else
             if(tempModel.complete>0)
             {
              model.complete++;
              model.CPactId.push(tempModel.actId);
             }
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
    child.phase=phase;
     this.scopingBucket.push(child);
  }
  if(phase=="Design")
  {
      child.phase=phase;
    this.designBucket.push(child);

  }
  if(phase=="Implementation")
  {
    child.phase=phase;
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
changeDetailView()
{
  this.showDetail=false;
}

setStats(dt,type)
{
  dt.filter(type,"stats","equals");
}
}
