import { Activity } from './../models/activity';
import { ActivityService } from './../services/activity.service';
import { AnalyticsService } from './../services/analytics.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
constructor(private anService:AnalyticsService,private activytService:ActivityService){}
    data:any=[];
    phasePieData:any=[];
    deptPieData:any=[];
    options: any=[];
    phasePieOptions:any=[];
    deptPieOptions:any=[];
    depts = [];
    overDue=[];
    needAtt=[];
    inProg=[];
    complete=[];
    deptDataSet=[];
    phaseDataSet=[];
    deptPieDataSet=[];
    acts:Activity[]=[];
    expand:boolean=true;
    phasesList=[];
    deptsList=[];
    deptColor=[];
    isDataAvailable:boolean;
    isPhaseDataAvailable:boolean;
    showDetail:boolean;
  ngOnInit() {
    this.deptColor=['#FF3333','#FFCC33','#00CCFF','#459E00'];
    //get all activities which are not closed  and percentage
    this.activytService.getAllInProg('all').subscribe(act=>{
     this.acts=act;
    });
    this.anService.getDeptProgress().subscribe(data=>{
        this.deptsList=data;
        let od:number=0;
        let na:number=0;
        let ip:number=0;
        let cp:number=0;
       data.forEach(el=> {
         this.depts.push(el._id.depName);
         this.overDue.push(el.OverDue);
         this.needAtt.push(el.NeedAttention);
         this.inProg.push(el.InProgress);
         this.complete.push(el.Completed);
         od+=el.OverDue;
         na+=el.NeedAttention;
         ip+=el.InProgress;
         cp+=el.Completed;
       });
        this.deptPieDataSet.push(od);
        this.deptPieDataSet.push(na);
        this.deptPieDataSet.push(ip);
        this.deptPieDataSet.push(cp);
        this.isDataAvailable=true;
        this.initDeptPieData()
    });

    //get phase analytics
    this.anService.getDeptPhaseProgress().subscribe(data=>{
        this.phasesList=data;
        let tScoping:number=0;
        let tDesign:number=0;
        let tImpl:number=0;
        data.forEach(el => {
          tScoping+=el.Scoping;
          tDesign+=el.Design;
          tImpl+=el.Implementation;
        });
       this.phaseDataSet.push(tScoping);
       this.phaseDataSet.push(tDesign);
       this.phaseDataSet.push(tImpl);
       this.initPhasesData();
       this.isPhaseDataAvailable=true;
    });
    //pie data

    //over due
         this.deptDataSet.push({
         label:"Over Due",
         backgroundColor:this.deptColor[0],
         borderColor: '#1E88E5',
         data:this.overDue
        });
         //need attention
         this.deptDataSet.push({
         label:"Need Attention",
         backgroundColor:this.deptColor[1],
         borderColor: '#1E88E5',
         data:this.needAtt
        });
         //in progress
         this.deptDataSet.push({
         label:"In Progress",
         backgroundColor:this.deptColor[2],
         borderColor: '#1E88E5',
         data:this.inProg
        });
        //complete
         this.deptDataSet.push({
         label:"Completed",
         backgroundColor:this.deptColor[3],
         borderColor: '#1E88E5',
         data:this.complete
        });
    this.data = {
            labels: this.depts,
            datasets:  this.deptDataSet
        }
        this.options = {
             scales: {
            xAxes: [{
                stacked: true,
                ticks: {mirror: true}
            }],
            yAxes: [{
                stacked: true,
                gridLines: { display: false }
            }]
        },
        legend:{
          position:'top',
           labels:{
             boxWidth:10
           }
        }
      };
      this.phasePieOptions = {
        legend:{
          position:'top',
            labels: {
                usePointStyle:true
            }
        }
      };

       this.deptPieOptions = {
        legend:{
          position:'top',
            labels: {
                usePointStyle:true
            },
        },
        title: {
            display: true,
            text: 'Aggregated Activities Status'
        }
        };
  }
  selectData(evt)
  {
  debugger;
  let deptName=evt.element._model.label;
  this.activytService.getAllInProg(deptName).subscribe(act=>{
     this.acts=act;
    });
    //iterate over the main list and update the pie chart for phases
    this.phaseDataSet=[];
    this.phasesList.forEach(el => {
     if(el._id.depName==deptName)
     {
       this.phaseDataSet.push(el.Scoping);
       this.phaseDataSet.push(el.Design);
       this.phaseDataSet.push(el.Implementation);
       this.initPhasesData();
     }
    });

    if(!this.showDetail)//if chart is visibel
    {
      //iterate over the main list and update the pie chart for depts
      this.deptPieDataSet=[];
      this.deptsList.forEach(el => {
      if(el._id.depName==deptName)
      {
        this.deptPieDataSet.push(el.OverDue);
        this.deptPieDataSet.push(el.NeedAttention);
        this.deptPieDataSet.push(el.InProgress);
        this.deptPieDataSet.push(el.Completed);
        this.initDeptPieData();
      }
      });
    }
  this.expand=false;
}
//set pie data for phases
private initPhasesData() {
  this.phasePieData = {
            labels: ['Scoping','Design','Implementation'],
            datasets: [
                {
                    data: this.phaseDataSet,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            };
}
//set pie data for phases
private initDeptPieData() {
  this.deptPieData = {
            labels: ['Over Due','Need Attention','In Progress' , 'Completed'],
            datasets: [
                {
                    data: this.deptPieDataSet,
                    backgroundColor: [
                        this.deptColor[0],
                        this.deptColor[1],
                        this.deptColor[2],
                        this.deptColor[3]
                    ]
                }]
            };
}
/**
 * to display detail of the this activity and its  chidren
 * @param id
 */
viewActDetail(id:string){
    this.showDetail=true;

}
}
