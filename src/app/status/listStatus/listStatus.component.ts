import { Status } from './../../models/status';
import {
  ConfirmationService
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listStatus',
  templateUrl: './listStatus.component.html',
  styleUrls: ['./listStatus.component.css']
})
export class ListStatusComponent implements OnInit {

   statuses: Status[];
  dialogVisible: boolean = false;
  status: Status;
  constructor(private statusService: StatusService ,private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllStatuss()
      .subscribe({

        next: status => this.statuses = status
      });;
  }
  //get all statusegories
  getAllStatuss() {

    return this
      .statusService
      .getAll();
  }

  deleteStatus(status) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .statusService
            .delete(status._id)
            .subscribe(data => {
              console.log('Status deteted - Service!');
              this
                .alertService
                .success('Status deleted!');

              //remove form statusegories list too
              this.statuses.splice(this.findSelectedStatusIndex(status),1);


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
  editStatus(status: Status) {
    this.dialogVisible = true;
    this.status = status;
  }
  //update Status
  updateStatus(status: Status) {
    this
      .statusService
      .update(status)
      .subscribe(data => {
        console.log('Status updated - Service!');
        this
          .alertService
          .success('Status updated!');
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
    this.status = new Status();
  }
  private findSelectedStatusIndex(status:Status): number {
       return this.statuses.indexOf(status);
    }
}
