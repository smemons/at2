import { UtilityService } from './../../services/utility.service';
import { SelectItem } from 'primeng/primeng';
import { Task } from './../../models/task';
import { AlertService } from './../../services/alert.service';
import { TaskService } from './../../services/task.service';
import { ActivityService } from './../../services/activity.service';
import { Activity } from './../../models/activity';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-viewActivity',
  templateUrl: './viewActivity.component.html',
  styleUrls: ['./viewActivity.component.css']
})
export class ViewActivityComponent implements OnInit {

  taskDialog:Boolean=false;
  activity:Activity;
  isChild:boolean;
  childrenActivities:Activity[];
  parentActivity:Activity;
  model: any = {};
  tasks:Task[];
  loading = false;
  category:string;

  status:string;

  focus:string;

  dept:string[]=[];

  phase:string;

  visibility:string[]=[];

  kpi:string;

  constructor(private route: ActivatedRoute,private router: Router,
              private taskService:TaskService,
              private alertService:AlertService,
              private activityService:ActivityService,
              private utilityService:UtilityService
              ) { }

  ngOnInit() {


      this.tasks=[];

      this.childrenActivities=[];
      this.activity=new Activity();
      let id:string;
     this.route.params.subscribe(params => {

       id = params['id'];


       this.parentActivity=null;

      //let id=this.route.snapshot.params['id'];
        this.activityService.getActivity(id).subscribe(act=>{
        this.activity=act;

         //get kpi
         if(act.kpiId!=null)
         {
            this.utilityService.getKpiById(act.kpiId).subscribe(kpi=>{
                this.kpi=kpi.title;
            });
         }
        //get category detail
        if(act.catId!=null)
        {
          this.utilityService.getCategoryById(act.catId).subscribe(cat=>{
          this.category=cat.title;
         });
        }

       //get status
          if(act.statusId!=null)
        {
          this.utilityService.getStatusById(act.statusId).subscribe(st=>{
          this.status=st.title;
         });
        }

       //get focus
        if(act.focusId!=null)
        {
          this.utilityService.getFocusById(act.focusId).subscribe(fc=>{
          this.focus=fc.title;
         });
        }

      //get all depts
       if(act.deptId!=null)
        {
debugger;
         this.utilityService.getAllDepts().subscribe(dept=>{
         //there may more then one dept
            let dptId=act.deptId;
            dptId.forEach(dpt => {
              this.dept.push(this.utilityService.getTitleById(dpt,dept));
             });
       });
        }





        //   this.utilityService.getDeptById(act.deptId).subscribe(dept=>{
        //     //there could be mulitple department
        //     dept.forEach(dpt=>{
        //         this.dept.push(dpt.title);
        //     });

        //  });
      //  }


    //get all visibilities
      if(act.visId!=null)
        {
           this.utilityService.getAllVisibilities().subscribe(vis=>{
            let visIds=act.visId;
            visIds.forEach(avis => {
              this.visibility.push(this.utilityService.getTitleById(avis,vis));
          });
       });

        //   this.utilityService.getVisById(act.visId).subscribe(vis=>{
        //   vis.forEach(vs=>{
        //         this.visibility.push(vs.title);
        //     });
        //  });
        }

     //get phase
     if(act.phaseId!=null)
        {
          this.utilityService.getPhaseById(act.phaseId).subscribe(ph=>{
          this.phase=ph.title;
         });
        }
///======================================================================================
          //get all tasks associated with this activity
        this.taskService.getAllByActivityId(id).subscribe(tasks=>this.tasks=tasks);

        //get all children activities associated with this activity
        this.activityService.getAllChildrenById(id).subscribe(act=>{

          this.childrenActivities=act
        });

        //if parentid exist
        if(this.activity.parentId!=null)
        {
          this.isChild=true;
          this.activityService.getActivity(this.activity.parentId).subscribe(el=>this.parentActivity=el);
        }

      });
    });




  }

  goback()
  {
     this.router.navigate(['/dashboard']);
    //  debugger;
    // this.router.navigateByUrl(this.previousUrl);
    // this.utilityService.back();
  }

  showTaskDialog()
  {

    this.taskDialog=true;
  }
  close()
  {
    this.taskDialog=false;
  }
  saveTask(id:string)
  {
     this.loading=true;
     this.model.activityId=id;
      event.preventDefault();
      this.taskService.create(this.model).subscribe(
                data => {
                   console.log('Task created - Service!');
                    this.alertService.success("Task saved!");
                    //this.taskService.getAllByActivityId(id).subscribe(tasks=>this.tasks=tasks);
                    this.tasks.push(data);


                },
                error => {

                    console.log(error);
                    this.alertService.error(error._body);
                    this.loading = false;
                });

      this.taskDialog = false;
      this.loading=false;
  }
  //create subactivity
  createSubActivity(act:Activity)
  {
    this.utilityService.setPassedActivity(act);
    this.utilityService.addChildActivity();

  }
 //viewActivity(act)
  viewActivity(id){
     this.router.navigate(['/viewActivity', id],{ skipLocationChange: true });
  }

  //task created event passed form component
  taskCreated(task)
  {

    this.taskDialog=false;
    this.tasks.unshift(task);

  }
  //again through injection
  taskClosed(val)
  {
    this.taskDialog=false;
  }
}
