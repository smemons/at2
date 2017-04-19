import { UtilityService } from './../../services/utility.service';
import { SelectItem } from 'primeng/primeng';
import { Task } from './../../models/task';
import { AlertService } from './../../services/alert.service';
import { TaskService } from './../../services/task.service';
import { ActivityService } from './../../services/activity.service';
import { Activity } from './../../models/activity';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

declare var moment: any;
@Component({
  selector: 'app-viewActivity',
  templateUrl: './viewActivity.component.html',
  styleUrls: ['./viewActivity.component.css']
})
export class ViewActivityComponent implements OnInit {

  taskDialog:boolean=false;
  taskUpdateDialog:boolean;
  activity:Activity;
  isChild:boolean;
  childrenActivities:Activity[];
  parentActivity:Activity;
  model: any = {};
  tasks:Task[];
  task:Task=new Task();
  loading = false;
  category:string;
  percentage:number;
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

        this.percentage=act.percentage;

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
         this.dept=[];
         this.utilityService.getAllDepts().subscribe(dept=>{
         //there may more then one dept
            let dptId=act.deptId;
            dptId.forEach(dpt => {
              this.dept.push(this.utilityService.getTitleById(dpt,dept));
             });
       });
        }







    //get all visibilities
      if(act.visId!=null)
        {
          this.visibility=[];
           this.utilityService.getAllVisibilities().subscribe(vis=>{
            let visIds=act.visId;
            visIds.forEach(avis => {
              this.visibility.push(this.utilityService.getTitleById(avis,vis));
          });
       });

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
          this.tasks=[];
        this.taskService.getAllByActivityId(id).subscribe(tasks=>{
          tasks.forEach(task => {
            debugger;

            let time = new Date().getTime() -  moment(task.createdAt).toDate().getTime();
            time=time/1000/60/60;
            if(time<8)
              {
                task.editable=true;
              }
              else
              {
                task.editable=false;
              }
             this.tasks.push(task);
          });
          //this.tasks=tasks;
        });

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
    this.taskUpdateDialog=false;
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
    let act=new Activity();
    act._id=task.activityId;
    act.percentage=task.percentage;
    this.activityService.updatePercentage(act).subscribe();
    this.percentage=task.percentage;
    this.taskDialog=false;
    task.editable=true;
    this.tasks.unshift(task);

  }
  //again through injection
  taskClosed(val)
  {
    this.taskDialog=false;
  }
  editTaskDialog(id)
  {
   this.utilityService.getTaskById(id).subscribe(task=>this.task=task);
    this.taskUpdateDialog=true;
  }
  //update task
  updateTask(task)
  {

     this.taskService.updateTask(task).subscribe(tsk=>
     {
       let act=new Activity();
        act._id=task.activityId;
        act.percentage=task.percentage;
        this.alertService.success('Progress updated!');
        this.activityService.updatePercentage(act).subscribe();
        this.percentage=task.percentage;
     });

     this.taskUpdateDialog=false;
     this.task=new Task();
  }
}
