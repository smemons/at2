import {DeptService} from '../../services/dept.service';
import {Router} from '@angular/router';
import {AlertService} from './../../services/alert.service';
import {Component, OnInit} from '@angular/core';

@Component({selector: 'app-addDept', templateUrl: './addDept.component.html', styleUrls: ['./addDept.component.css']})
export class AddDeptComponent implements OnInit {
  model : any = {};
  loading = false;
  constructor(private deptService : DeptService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createDept() {

    console.log(this.model);
    this.loading = true;
    this
      .deptService
      .create(this.model)
      .subscribe(data => {
        console.log('Dept created - Service!');
        this
          .alertService
          .success('Department created!');

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
