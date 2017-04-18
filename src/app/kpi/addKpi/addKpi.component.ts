import { KpiService } from './../../services/kpi.service';
import { Wrapper } from './../../models/wrapper';
import { DDType } from './../../models/DDType.enum';
import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { CacheStoreService } from './../../services/cacheStore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addKpi',
  templateUrl: './addKpi.component.html',
  styleUrls: ['./addKpi.component.css']
})
export class AddKpiComponent implements OnInit {

 model : any = {};
  loading = false;
  constructor(private cache:CacheStoreService ,private kpiService : KpiService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createKPI() {

    console.log(this.model);
    this.loading = true;
    this
      .kpiService
      .create(this.model)
      .subscribe(data => {
       let wrapper=new Wrapper(data.title,data._id,DDType.KPI);
       this.cache.isDataCreated.next(wrapper);
        this
          .alertService
          .success('KPI created!');

          this.router.navigate(['/home']);
      }, error => {

        console.log(error._body);
        this
          .alertService
          .error(error._body);
        this.loading = false;
      });

  }

}
