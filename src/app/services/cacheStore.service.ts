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

      categories :  SelectItem[]=[];
      statuses :    SelectItem[]=[];
      focuses :     SelectItem[]=[];
      depts :       SelectItem[]=[];
      phases :      SelectItem[]=[];
      visibilities: SelectItem[]=[];

constructor(private utilityService:UtilityService) {
this.isDataCreated.subscribe(data=>{

  let wrapper:Wrapper=data;
  this.addNewItem(wrapper);
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
    default:
      break;
  }
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


}
private getCategories() {
  if(this.categories.length==0){
      this.utilityService.getAllCategories().subscribe(cat=>{
       this.categories = this.utilityService.getSelectItemPublished(cat,"Category");
    })
  }
}

private getStatuses() {
  if(this.statuses.length==0){
      this.utilityService.getAllStatus().subscribe(elm=>{
       this.statuses = this.utilityService.getSelectItemPublished(elm,null);
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

private getvisibilities(){
  if(this.visibilities.length==0){
      this.utilityService.getAllVisibilities().subscribe(elm=>{
       this.visibilities = this.utilityService.getSelectItemPublished(elm,null);
    })
  }
}
}
