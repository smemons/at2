import { LoaderService } from './../services/loaderService';
import { DataTable } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
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
import { Component, OnInit,ViewChild } from '@angular/core';
@Component({
  selector: 'app-analytics2',
  templateUrl: './analytics2.component.html',
  styleUrls: ['./analytics2.component.css']
})
export class Analytics2Component implements OnInit {
hasChild: boolean;
displayActivity: boolean;
isDataAvailable:boolean;
statusData:any=[];
selectedRef:string;
prevDeptCss:any;
prevRefCss:any;
selectedRefDepts:any=[];
refSelectExpand:boolean;
refActExpand:boolean=true;
refActivities:any=[];
showDetail:boolean;
detailHeading:string="Overview";
tasks:any=[];
allActivitiesStore:any=[];
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
activity:any=[];
private activityListChanged = new BehaviorSubject<string>("");
  constructor(private anService:AnalyticsService,private utilityService:UtilityService, private loaderService:LoaderService,
  private cache:CacheStoreService,private activityService:ActivityService, private taskService:TaskService) { }
  @ViewChild('dt2') actTable: DataTable;

  ngOnInit() {

   this.utilityService.getAllPhases().subscribe(data=>{

      this.utilityService.phaseKeyValues=new Map();
      data.forEach(el => {
        this.utilityService.phaseKeyValues.set(el._id,el.title);
      });

    });
    //get all status by ref
    // this.anService.getStatusByRef().subscribe(data=>{
    // this.statusData=data;
    //  this.isDataAvailable=true;
    // });
    if(this.refList.length==0)
    {
      this.cache.getCategoriesAll();
    }
    //populate stats panel with group by dept and calculate all children for overdue, needatt etc
    this.populateGrByDeptStats();
     //populate stats panel with group by cat and calculate all children for overdue, needatt etc
    this.populateGrByCatStats();
   this.poupulateInitialActList();
  }
/**
 * populateInitialActList initialize the activity panel with list of all  0 level projects and its status
 */
private poupulateInitialActList()
{
   this.refActivities=[];
   this.loaderService.showLoader();
   this.anService.getAllActAggregated().subscribe(data=>{
debugger;
     data.forEach(el => {
       let model:statsModel={};
       model.inProg=0;
       model.needAtt=0;
       model.overDue=0;
       model.complete=0;
       this.calcEach(el,model);
     });

     this.selectedRefDepts=this.allActivitiesStore=this.refActivities;
     this.loaderService.hideLoader();
   },err=>this.loaderService.hideLoader());
}
  //get all drop down from cache service
get refList():SelectItem[] {
  return this.cache.categories;
}
/**
 *
 * click on the link of tables for stats and decide what to do with it.
 */
setActivitiesData(event,item,statsType?:string,actionType?:string)
{

    this.actTable.reset();
    if(actionType=="CAT")
    {
    if(this.prevRefCss!=null && this.prevRefCss!=="")
      {
        document.getElementById(this.prevRefCss).classList.remove("selected");
      }
      var target = event.target || event.srcElement || event.currentTarget;
      this.prevRefCss=target.id;
      target.classList.add("selected");
    }
    else
    if(actionType=="DPT")
      {
      if(this.prevDeptCss!=null && this.prevDeptCss!=="")
        {
          document.getElementById(this.prevDeptCss).classList.remove("selected");
        }
        var target = event.target || event.srcElement || event.currentTarget;
        this.prevDeptCss=target.id;
        target.classList.add("selected");
      }
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
    //this.refSelectExpand=true;
  if(actionType=="CAT")
  {
    this.selectedRef=item.catId;
    // this.selectedAct=" - "+item.catName;
    // this.selectedDept="";
    this.populateGrByDeptStats(item.catId);
    //this.selectedDept="";
    this.getAllActivitiesByCatId(this.selectedRef,actIds,statsType);
  }
  if(actionType=="DPT")
  {
    let deptId=item.deptId;
   // this.deptSelectTitle=item.deptName;
    // this.selectedDept=" - "+item.deptName;
    this.getAllActivitiesByDeptId(deptId,actIds,statsType);
  }
}
/**
 * when reference dropdown changes
 * @param evt
 */
refStatusChanged(evt)
{

    if(this.prevRefCss!=null && this.prevRefCss!=="")
      {
        document.getElementById(this.prevRefCss).classList.remove("selected");
      }
  this.getActivitiesOnRefChg(evt.value);
  //this.refSelectExpand=true;
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
 * when ref drop down changes, load the activity panel with relevant activities found by catId
 */
private getActivitiesOnRefChg(id)
{
    this.anService.getActsGrByCat(id).subscribe(data=>{
    this.refActivities=[];
    if(id=="all")
    this.selectedAct="";
    else
     if(data.length>0)
      this.selectedAct=" - "+data[0]._id.catName;
     data.forEach(el => {
          this.calcEachActivity(el);
     });
    this.refActExpand=false;
    this.selectedRefDepts=this.refActivities;
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
           act.refTitle=field.cat.title;
           act.assignee=field.assignee;
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
      let perc=0;
      if(this.selectedActivity.percentage!=null) perc=this.selectedActivity.percentage;
      let delta=0;
      if(this.selectedActivity.delta!=null) delta=this.selectedActivity.delta;
      this.detailHeading=data[0].title +"   ("+perc+"% , Δ "+delta+"%)";
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
   this.loaderService.showLoader();
   this.anService.getActsGrByDept(id,"cat").subscribe(data=>{
  debugger;
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
     this.loaderService.hideLoader();
   },err=> this.loaderService.hideLoader());
}
private populateGrByCatStats()
{
   this.catStatsModel=[];
      this.loaderService.showLoader();
   this.anService.getActsGrByCat("all").subscribe(data=>{

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
     this.loaderService.hideLoader();
   },err=>this.loaderService.hideLoader());
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
  this.detailHeading="Overview";
  this.showDetail=false;
  this.tasks=[];
}
setStats(dt,type)
{
  dt.filter(type,"stats","equals");
}
setStatsWithAllAct(event,dt,type)
{

debugger;
   if(this.prevRefCss!=null && this.prevRefCss!=="")
   {
    document.getElementById(this.prevRefCss).classList.remove("selected");
   }
  var target = event.target || event.srcElement || event.currentTarget;
  this.prevRefCss=target.id;
  target.classList.add("selected");
  this.refActivities = this.allActivitiesStore;

  this.refActExpand=false;
  this.selectedRef="all";
   this.populateGrByDeptStats("all");
  this.actTable.reset();
  this.actTable.filter(type,"stats","equals");
}
setStatsActByDept(event,dt,type)
{
  debugger;

   if(this.prevDeptCss!=null && this.prevDeptCss!=="")
   {
    document.getElementById(this.prevDeptCss).classList.remove("selected");
   }
  var target = event.target || event.srcElement || event.currentTarget;
  this.prevDeptCss=target.id;
  target.classList.add("selected");
  this.refActivities=this.selectedRefDepts;
  this.actTable.reset();
  this.actTable.filter(type,"stats","equals");
}

showActDetail(id)
{
  this.hasChild=false;
 this.activityService.getActivityById(id).subscribe(act=>{
   debugger;
   this.activity=act[0];
   console.log(this.activity);
   if(this.activity.level>0)this.hasChild=true;
   this.displayActivity=true;
 });
}

}
