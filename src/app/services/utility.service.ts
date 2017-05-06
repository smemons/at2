import { statsModel } from './../models/statsModel';
import { Location } from '@angular/common';
import { Activity } from './../models/activity';
import { SelectItem } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { User } from './../models/user';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
declare var moment: any;
@Injectable()
export class UtilityService {
passedActivity:Activity;
previousUrl:string;
phaseKeyValues:Map<string,string>;
constructor(private http:Http,private location:Location,private router:Router) {
 }
//get all Category
 getAllCategories() {
    return this
      .http
      .get('/api/category/all')
      .map((response: Response) => response.json());
  }
//////////////////////////////////////////////
//get all dept
getAllDepts() {
    return this
      .http
      .get('/api/dept/all')
      .map((response : Response) => response.json());
  }
  //////////////////////////////////////////////
  //get all focuses
  getAllFocuses() {
    return this
      .http
      .get('/api/focus/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////
  //get all phases
   getAllPhases() {
    return this
      .http
      .get('/api/phase/all')
      .map((response : Response) => response.json());
  }
   ///////////////////////////////////////////////
  //get all kpi
   getAllKpis() {
    return this
      .http
      .get('/api/kpi/all')
      .map((response : Response) => response.json());
  }
   ///////////////////////////////////////////////
   //get all Visibility
  getAllVisibilities() {
    return this
      .http
      .get('/api/vis/all')
      .map((response : Response) => response.json());
  }
 ///////////////////////////////////////////////// get all Status
  getAllStatus() {
    return this
      .http
      .get('/api/status/all')
      .map((response : Response) => response.json());
  }
  ///////////////////////////////////////////////// get all Users
  getAllUsers() {
    return this
      .http
      .get('/api/user/all')
      .map((response : Response) => response.json());
  }
////////////////////////////////////
   //get  kpi
   getKpiById(id:string) {
    return this
      .http
      .get('/api/kpi/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
   //get  category by id
   getCategoryById(id:string) {
    return this
      .http
      .get('/api/category/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  category by id
   getStatusById(id:string) {
    return this
      .http
      .get('/api/status/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  category by id
   getPhaseById(id:string) {
    return this
      .http
      .get('/api/phase/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  category by id
   getVisById(id:string) {
    return this
      .http
      .get('/api/vis/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  category by id
   getFocusById(id:string) {
    return this
      .http
      .get('/api/focus/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  category by id
   getDeptById(id:string) {
    return this
      .http
      .get('/api/dept/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
     //get  task by id
   getTaskById(id:string) {
    return this
      .http
      .get('/api/task/'+id)
      .map((response : Response) => response.json());
  }
  ////////////////////////////////////////////////
//return the typeahead portion of users for string completion
  getUsersTypeAhead(q:string)
  {
    return this
      .http
      .get('/api/user/search/'+q)
      .map((response: Response) => response.json());
  }
/**
 * get selected item from given array by given id
 */
  getTitleById(id:string,list:Array<any>):string
  {
    let ret="";
    list.forEach(elm => {
      if(id===elm._id)
      {
        ret=elm.title;
      }
    });
    return ret;
  }
/**
 * getSelectItemPublished
 * get seletItem publised with given data in format of primeng
 */
  getSelectItemPublished(itmArry:any[],title:string):SelectItem[]
  {
   let si:SelectItem[]=[];
   if(title!=null)
        si.push({label:"Select "+title, value:null});
   itmArry.forEach(element => {
      si.push({label:element.title, value:element._id});
   });
   return si;
  }
  /**
 * getSelectItemPublishedAll
 * get seletItem publised with given data in format of primeng
 */
  getSelectItemPublishedAll(itmArry:any[],title:string):SelectItem[]
  {
   let si:SelectItem[]=[];
   if(title!=null)
        si.push({label:"All "+title, value:"all"});
   itmArry.forEach(element => {
      si.push({label:element.title, value:element._id});
   });
   return si;
  }
  //set passed activity for transport to other component
  setPassedActivity(act:Activity)
  {
    this.passedActivity=act;
  }
  //get passed activity
  getPassedActivity():Activity
  {
    if(this.passedActivity==null)
        this.passedActivity=new Activity();
    return this.passedActivity;
  }
   //view selected Activity and store the previous location
  viewActivity(id)
  {
    this.router.navigate(['/viewActivity', id],{ skipLocationChange: true });
  }
  //add child activity
  addChildActivity()
  {
    this.router.navigate(['/addChildActivity']);
  }
  //go back
  back()
  {
   // this.location.back(); // <-- go back to previous location on cancel
   this.router.navigateByUrl(this.previousUrl);
  }
  //get current user
  getCurrentUser():string
  {
    let usr="";
     if(sessionStorage.getItem('currentUser')){
        usr = JSON.parse(sessionStorage.getItem('currentUser')).username;
     }
     return usr;
  }
  /**
   * get status based on time -
   * return values: overdue, need attention, in progress and completed
   * param: startdate, enddate, completPerc
   */
  getComputedStatus(startDate:Date,endDate:Date,perc:number=0):string
  {
    let status="";
    let start         =moment(startDate);
    let end           =moment(endDate);
    let today         =moment();
    let totalDays     =end.diff(start,'days');
    let consumedDays  =today.diff(start,'days');
    let remainDays    =end.diff(today,'days');
    let actual=(consumedDays/totalDays)*100;
    if(perc==100) status="Completed";
    else
    if(perc < 100 && remainDays < 0) status="Over Due";
    else
    if(actual>perc && remainDays >=  0) status="Need Attention";
    else
    if(actual<=perc && remainDays >=  0 ) status="In Progress";


        return status;
  }
/**
 * find stats for any array of children.. returns statsmodel with counted fields
 * @param children
 */
  findStatsInChildren(el:any)
  {
    let model:statsModel={};
    model.actId=[];
    model.overDue=0;
    model.complete=0;
    model.needAtt=0;
    model.inProg=0;
    model.actId=el._id;
    let ret=this.getComputedStatus(el.startDate,el.endDate,el.percentage);
        if(ret=="Over Due")model.overDue++;
        else
        if(ret=="Need Attention")model.needAtt++;
        else
        if(ret=="In Progress")model.inProg++;
        else
        if(ret=="Completed")model.complete++;
    el.children.forEach(child => {
      let res=this.getComputedStatus(child.startDate,child.endDate,child.percentage);
        if(res=="Over Due")model.overDue++;
        else
        if(res=="Need Attention")model.needAtt++;
        else
        if(res=="In Progress")model.inProg++;
        else
        if(res=="Completed")model.complete++;
    });
     return model;
  }
}
