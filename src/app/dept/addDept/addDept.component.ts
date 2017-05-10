import { CacheStoreService } from './../../services/cacheStore.service';
import { Wrapper } from './../../models/wrapper';
import { DDType } from './../../models/DDType.enum';
import {DeptService} from '../../services/dept.service';
import {Router} from '@angular/router';
import {AlertService} from './../../services/alert.service';
import {Component, OnInit} from '@angular/core';


@Component({selector: 'app-addDept', templateUrl: './addDept.component.html', styleUrls: ['./addDept.component.css']})
export class AddDeptComponent implements OnInit {
  model : any = {};
  loading = false;
  constructor(private deptService : DeptService, private cache:CacheStoreService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createDept() {

    console.log(this.model);
    this.loading = true;
    this
      .deptService
      .create(this.model)
      .subscribe(data => {
          let wrapper=new Wrapper(data.title,data._id,DDType.DEPT);
          this.cache.isDataCreated.next(wrapper);
        this
          .alertService
          .success('Department created!');

          this.router.navigate(['/listDept']);
      }, error => {

        console.log(error._body);
        this
          .alertService
          .error(error._body);
        this.loading = false;
      });

  }

}
