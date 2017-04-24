import { AnalyticsService } from './../services/analytics.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
constructor(private anService:AnalyticsService){}
    data:any;
    options: any;
    depts = [];
    overDue=[];
    needAtt=[];
    inProg=[];
    complete=[];
    dataSet=[];
  ngOnInit() {
     let color=['#42A543','#af2364','#11237c','#f9de0e'];
    this.anService.getDeptProgress().subscribe(data=>{

       data.forEach(el=> {
         this.depts.push(el._id.depName[0]);

         this.overDue.push(el.OverDue);
         this.needAtt.push(el.NeedAttention);
         this.inProg.push(el.InProgress);
         this.complete.push(el.Completed);
         //over due
        //  this.dataSet.push({
        //  label:"Over Due",
        //  backgroundColor:color[0],
        //  borderColor: '#1E88E5',
        //  data:[el.OverDue]
        // });

       });
    });

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
//  var datasetValue = [];
// var count = 4;
// for (var j=0; j<count; j++) {
//   let dt=[];
//   for(let x=0;x<5;x++)
//   {
//     dt.push(Math.round(Math.random() * 100));
//   }
//     datasetValue[j] = {
//         backgroundColor: color[j],
//         borderColor: color[count-j],
//         label :'item '+j,
//         data : dt
//     }
// }
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
        }
        };
  }
  selectData(evt)
  {
  //  debugger;
    console.log(evt);
  }
}
