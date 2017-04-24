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
    tScoping:number=0;
    tDesign:number=0;
    tImpl:number=0;
    acts:Activity[]=[];
  ngOnInit() {
    //get all activities which are not closed  and percentage
    this.activytService.getAll().subscribe(act=>{
     this.acts=act;
    });

     let color=['#FF3333','#FFCC33','#00CCFF','#33FF66'];
    this.anService.getDeptProgress().subscribe(data=>{

       data.forEach(el=> {
         this.depts.push(el._id.depName);
         this.overDue.push(el.OverDue);
         this.needAtt.push(el.NeedAttention);
         this.inProg.push(el.InProgress);
         this.complete.push(el.Completed);
         this.tScoping+=el.Scoping;
         this.tDesign+=el.Design;
         this.tImpl+=el.Implementation;

       });
       this.pieDataSet.push(this.tScoping);
       this.pieDataSet.push(this.tDesign);
       this.pieDataSet.push(this.tImpl);
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
                    ],
                    hoverBackgroundColor: [
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
  //  debugger;
    console.log(evt);
  }
}
