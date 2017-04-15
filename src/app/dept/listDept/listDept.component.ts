import {
  ConfirmationService
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { DeptService } from './../../services/dept.service';
import { Dept } from './../../models/dept';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listDept',
  templateUrl: './listDept.component.html',
  styleUrls: ['./listDept.component.css']
})
export class ListDeptComponent implements OnInit {

  depts: Dept[];
  dialogVisible: boolean = false;
  dept: Dept;
  constructor(private deptService: DeptService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllDepts()
      .subscribe({

        next: dept => this.depts = dept
      });;
  }
  //get all deptegories
  getAllDepts() {

    return this
      .deptService
      .getAll();
  }

  deleteDept(dept) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .deptService
            .delete(dept._id)
            .subscribe(data => {
              console.log('Dept deteted - Service!');
              this
                .alertService
                .success('Dept deleted!');

              //remove form deptegories list too
              this.depts.splice(this.findSelectedDeptIndex(dept),1);


            }, error => {
              //this.alertService.error(error);
              console.log(error);
              this
                .alertService
                .error(error);

            });
        }
      });
  }
  editDept(dept: Dept) {
    this.dialogVisible = true;
    this.dept = dept;
  }
  //update Dept
  updateDept(dept: Dept) {
    this
      .deptService
      .update(dept)
      .subscribe(data => {
        console.log('Dept updated - Service!');
        this
          .alertService
          .success('Dept updated!');
        this.dialogVisible = false;

      }, error => {
        //this.alertService.error(error);
        console.log(error);
        this
          .alertService
          .error(error);
        this.dialogVisible = false;
      });
  }

  //cancel
  cancel() {
    this.dialogVisible = false;
    this.dept = new Dept();
  }
  private findSelectedDeptIndex(dept:Dept): number {
       return this.depts.indexOf(dept);
    }
}
