import { Activity } from './../models/activity';

import { element } from 'protractor';
import { MiniActivity } from './../models/miniActivity';
import { ActivityService } from './activity.service';
import { DDType } from '../models/DDType.enum';
import { Wrapper } from './../models/wrapper';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { UtilityService } from './utility.service';
import { SelectItem } from 'primeng/primeng';
import { Injectable } from '@angular/core';
/**
 * cache store to store all drop down in cache and when the data changes,
 * cache service will observe and maintain the store
 */
@Injectable()
export class CacheStoreService {
isDataCreated: Subject<any> = new BehaviorSubject(Wrapper);
isActivityCreated: Subject<any> = new BehaviorSubject(MiniActivity);
isActivityChanged: Subject<any> = new BehaviorSubject(Activity);

      categories :  SelectItem[]=[];
      statuses :    SelectItem[]=[];
      focuses :     SelectItem[]=[];
      depts :       SelectItem[]=[];
      phases :      SelectItem[]=[];
      visibilities: SelectItem[]=[];
      kpis: SelectItem[]=[];
      activity:MiniActivity =new MiniActivity();
      assigned:MiniActivity[]=[];
      created:MiniActivity[]=[];

constructor(private utilityService:UtilityService,private activityService:ActivityService) {
this.isDataCreated.subscribe(data=>{
  let wrapper:Wrapper=data;
  this.addNewItem(wrapper);
});


//is activity changed
this.isActivityChanged.subscribe(act=>{
 //check array of my created and change percentage there
 this.created.forEach(el => {
 if(el._id==act._id)
 {
   el.percentage=act.percentage;
 }
});

//check array of my assignment and change percentage there
 this.assigned.forEach(el => {
 if(el._id==act._id)
 {
   el.percentage=act.percentage;
 }
 });
});

///////////////////////////////////////////
    //subscribe to a subject created by create Activity component
    //if activity was created
let loggedInUser=utilityService.getCurrentUser();
this.isActivityCreated.subscribe(data=>{
  this.activity=data;

  //if created by logged in user
  if(this.activity.createdBy==loggedInUser)
  {
    this.created.unshift(this.activity);
  }
  //if assigned to me
 if(this.activity.assignee!=undefined)
 {
  this.activity.assignee.forEach(str=>{
    if(str==loggedInUser)
      {
        this.assigned.unshift(this.activity);
      }
  })
 }

});

}

addNewItem(wrapper:Wrapper)
{
  switch (wrapper.type) {
    case DDType.CATEGORY:
       let item:SelectItem={label:wrapper.label,value:wrapper.id};
       this.categories.push(item);
      break;
 case DDType.DEPT:
       let dept:SelectItem={label:wrapper.label,value:wrapper.id};
       this.depts.push(dept);
      break;
      case DDType.FOCUS:
       let focus:SelectItem={label:wrapper.label,value:wrapper.id};
       this.focuses.push(focus);
      break;
      case DDType.PHASE:
       let phase:SelectItem={label:wrapper.label,value:wrapper.id};
       this.phases.push(phase);
      break;
      case DDType.STATUS:
       let status:SelectItem={label:wrapper.label,value:wrapper.id};
       this.statuses.push(status);
      break;
      case DDType.VISIBILITY:
       let vis:SelectItem={label:wrapper.label,value:wrapper.id};
       this.visibilities.push(vis);
      break;
       case DDType.VISIBILITY:
       let kpi:SelectItem={label:wrapper.label,value:wrapper.id};
       this.kpis.push(kpi);

    default:
      break;
  }
}

/**
 * populate all assigned activities
 */
populateAllActivities()
{
  this.getAllActivities();
}
//populate all drop downs array with intial data from db
 populateAll() {
    //get categories
    this.getCategories();
    this.getDepts();
    this.getFocuses();
    this.getPhases();
    this.getStatuses();
    this.getvisibilities();
    this.getKpis();


}
private getCategories() {
  if(this.categories.length==0){
      this.utilityService.getAllCategories().subscribe(cat=>{
       this.categories = this.utilityService.getSelectItemPublished(cat,"Reference");
    })
  }
}

private getStatuses() {
  if(this.statuses.length==0){
      this.utilityService.getAllStatus().subscribe(elm=>{
       this.statuses = this.utilityService.getSelectItemPublished(elm,"Status");
    })
  }
}

private getFocuses() {
  if(this.focuses.length==0){
      this.utilityService.getAllFocuses().subscribe(elm=>{
       this.focuses = this.utilityService.getSelectItemPublished(elm,"Focus");
    })
  }
}
private getDepts() {
  if(this.depts.length==0){
      this.utilityService.getAllDepts().subscribe(elm=>{
       this.depts = this.utilityService.getSelectItemPublished(elm,null);
    })
  }
}
private getPhases(){
  if(this.phases.length==0){
      this.utilityService.getAllPhases().subscribe(elm=>{
       this.phases = this.utilityService.getSelectItemPublished(elm,"Phase");
    })
  }
}

private getKpis(){
  if(this.phases.length==0){
      this.utilityService.getAllKpis().subscribe(elm=>{
       this.kpis = this.utilityService.getSelectItemPublished(elm,"KPI");
    })
  }
}
private getvisibilities(){
  if(this.visibilities.length==0){
      this.utilityService.getAllVisibilities().subscribe(elm=>{
       this.visibilities = this.utilityService.getSelectItemPublished(elm,null);
    })
  }
}

//get all activities for this users and put them in small objects for displaying purpose alone.
private getAllActivities()
{

  let loggedInUser=this.utilityService.getCurrentUser();

    //get all assigned
    if(this.assigned.length==0)
    {
     this.activityService.getAllAssigned(loggedInUser).
                          subscribe(act=>{
                            act.forEach(el => {
                             let mini=new MiniActivity();
                                mini._id=el._id;
                                mini.assignee=el.assignee;
                                mini.endDate=el.endDate;
                                mini.startDate=el.startDate;
                                mini.title=el.title;
                                mini.percentage=el.percentage;
                                mini.createdBy=el.createdBy;
                             this.assigned.push(mini);
                            });

                                });
    }

     //get all created
      if(this.created.length==0)
    {
                     this.activityService.getAllCreated(loggedInUser).
                          subscribe(act=>{

                            act.forEach(el => {
                             let mini=new MiniActivity();
                                mini._id=el._id;
                                mini.assignee=el.assignee;
                                mini.endDate=el.endDate;
                                mini.startDate=el.startDate;
                                mini.title=el.title;
                                mini.percentage=el.percentage;
                                 mini.createdBy=el.createdBy;
                             this.created.push(mini);
                            });

                          });
    }
}
}
