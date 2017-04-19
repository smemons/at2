
import { Location } from '@angular/common';
import { Activity } from './../models/activity';
import { SelectItem } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { User } from './../models/user';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';


@Injectable()
export class UtilityService {


passedActivity:Activity;
previousUrl:string;
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
}
