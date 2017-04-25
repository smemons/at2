
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
    data:any;
    pieData:any;
    options: any;
    pieOptions:any;
    depts = [];
    overDue=[];
    needAtt=[];
    inProg=[];
    complete=[];
    dataSet=[];
    pieDataSet=[];

    acts:Activity[]=[];
    expand:boolean=true;
    mainList=[];
  ngOnInit() {
    let tScoping:number=0;
    let tDesign:number=0;
    let tImpl:number=0;
    //get all activities which are not closed  and percentage
    this.activytService.getAllInProg('all').subscribe(act=>{
     this.acts=act;
    });

     let color=['#FF3333','#FFCC33','#00CCFF','#33FF66'];
    this.anService.getDeptProgress().subscribe(data=>{
       this.mainList=data;
       data.forEach(el=> {
         this.depts.push(el._id.depName);
         this.overDue.push(el.OverDue);
         this.needAtt.push(el.NeedAttention);
         this.inProg.push(el.InProgress);
         this.complete.push(el.Completed);
         tScoping+=el.Scoping;
         tDesign+=el.Design;
         tImpl+=el.Implementation;

       });
       this.pieDataSet.push(tScoping);
       this.pieDataSet.push(tDesign);
       this.pieDataSet.push(tImpl);
    });

    //pie data
     this.pieData = {
            labels: ['Scoping','Design','Implementation'],
            datasets: [
                {
                    data: this.pieDataSet,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            };


    //over due
         this.dataSet.push({
         label:"Over Due",
         backgroundColor:color[0],
         borderColor: '#1E88E5',
         data:this.overDue
        });
         //need attention
         this.dataSet.push({
         label:"Need Attention",
         backgroundColor:color[1],
         borderColor: '#1E88E5',
         data:this.needAtt
        });
         //in progress
         this.dataSet.push({
         label:"In Progress",
         backgroundColor:color[2],
         borderColor: '#1E88E5',
         data:this.inProg
        });
        //complete
         this.dataSet.push({
         label:"Completed",
         backgroundColor:color[3],
         borderColor: '#1E88E5',
         data:this.complete
        });

    this.data = {
            labels: this.depts,
            datasets:  this.dataSet
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

      this.pieOptions = {

        legend:{
          position:'top',
            labels: {
                usePointStyle:true
            }
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
    this.pieDataSet=[];
    this.mainList.forEach(el => {
     if(el._id.depName==deptName)
     {
       this.pieDataSet.push(el.Scoping);
       this.pieDataSet.push(el.Design);
       this.pieDataSet.push(el.Implementation);
       this.pieData = {
            labels: ['Scoping','Design','Implementation'],
            datasets: [
                {
                    data: this.pieDataSet,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            };

     }
    });
  this.expand=false;

  }
}
