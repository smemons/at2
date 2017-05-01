import { MiniActivity } from './../../models/miniActivity';
import { CacheStoreService } from '../../services/cacheStore.service';
import { UtilityService } from '../../services/utility.service';
import { AlertService } from './../../services/alert.service';
import { CategoryService } from '../../services/category.service';
import { Userservice } from './../../services/userservice.service';
import { Category } from './../../models/category';
import { SelectItem } from 'primeng/primeng';
import { element } from 'protractor';
import { Activity } from './../../models/activity';
import { Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from './../../services/auth.service';
import { Component, NgZone, OnInit } from '@angular/core';
declare var moment: any;
@Component({
  selector: 'app-listActivities',
  templateUrl: './listActivities.component.html',
  styleUrls: ['./listActivities.component.css']
})

export class ListActivitiesComponent implements OnInit {

  displayDialog: boolean = false;
  taskDialog:boolean;
  activity:Activity=new Activity();
  activityId:string;
  percentage:number;
  assignees: SelectItem[];
  categories:Category[];
  selectedCategory:string;
  listStatuses:SelectItem[];
  assigned:any=[];
  created:any=[];

  constructor(private authService:AuthService,
              private userService:Userservice,
              private categoryService:CategoryService,
              private activityService:ActivityService,
              private alertService:AlertService,
              private utilityService:UtilityService,
              private cache:CacheStoreService,
              private router:Router
              ) { }

  ngOnInit() {

    this.categoryService.getAll().subscribe(cat=>this.categories=cat);
    let loggedInUser=this.authService.getCurrentUser();
    this.cache.populateAllActivities();
    //get all assigned
     this.activityService.getAllAssigned(loggedInUser).
                          subscribe(act=>{
                            act.forEach(element => {
                              element.startDate=moment(element.startDate).toDate();
                              element.endDate=moment(element.endDate).toDate();
                            });
                            this.assigned=act
                          });

     //get all created
                     this.activityService.getAllCreated(loggedInUser).
                          subscribe(act=>{

                            act.forEach(element => {

                              element.startDate=moment(element.startDate).toDate();
                              element.endDate=moment(element.endDate).toDate();
                            });
                            this.created=act
                          });

                          //get all statuses for color

                  this.listStatuses=[];
                  this.utilityService.getAllStatus().subscribe(status=>{

                    status.forEach(element => {
                      this.listStatuses.push({label:element.title, value:element._id});
                    });


    })


  }



   //edit activity
  editAct(id:string)
  {
    this.activityService.getActivity(id).subscribe(act=>{
            this.activity=act;
            this.selectedCategory=this.utilityService.getTitleById(act.catId,this.categories);
            this.displayDialog = true;
          });
  }

  //update the Activity
  updateActivity(act:Activity)
  {
     this.activityService.update(act)
            .subscribe(
                data => {
                   console.log('Category updated - Service!');
                   this.alertService.success('Activty updated!');
                   this.displayDialog = false;

                },
                error => {
                    //this.alertService.error(error);
                    console.log(error);
                    this.alertService.error(error);
                     this.displayDialog = false;
                });
   }

  //viewActivity(act)
  viewActivity(id:string){
    this.utilityService.viewActivity(id);
  }

  closeActivityDialog()
  {
    this.displayDialog = false;
  }

  createTask(id:string,percentage:number)
  {
    this.activityId=id;
    this.percentage=percentage;
    this.taskDialog=true;
  }
  //task created event passed form component
  taskCreated(task)
  {

    let act=new Activity();
    act._id=task.activityId;
    act.percentage=task.percentage;
    this.activityService.updatePercentage(act).subscribe();
    //tell cache that data is changed
    this.cache.isActivityChanged.next(act);

    this.taskDialog=false;
  }
  //again through injection
  taskClosed(val)
  {
    this.taskDialog=false;
  }

  // get assigned():MiniActivity[]
  // {
  //   return this.cache.assigned;
  // }
  // get created():MiniActivity[]
  // {
  //   return this.cache.created;
  // }

}
