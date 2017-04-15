import {
  ConfirmationService
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { VisibilityService } from './../../services/visibility.service';
import { Visibility } from './../../models/visibility';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listVis',
  templateUrl: './listVis.component.html',
  styleUrls: ['./listVis.component.css']
})
export class ListVisComponent implements OnInit {

 visibilities: Visibility[];
  dialogVisible: boolean = false;
  vis: Visibility;
  constructor(private visibilityService: VisibilityService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllVisibilitys()
      .subscribe({

        next: vis => this.visibilities = vis
      });;
  }
  //get all visegories
  getAllVisibilitys() {

    return this
      .visibilityService
      .getAll();
  }

  deleteVisibility(vis) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .visibilityService
            .delete(vis._id)
            .subscribe(data => {
              console.log('Visibility deteted - Service!');
              this
                .alertService
                .success('Visibility deleted!');

              //remove form visegories list too
              this.visibilities.splice(this.findSelectedVisibilityIndex(vis),1);


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
  editVisibility(vis: Visibility) {
    this.dialogVisible = true;
    this.vis = vis;
  }
  //update Visibility
  updateVisibility(vis: Visibility) {
    this
      .visibilityService
      .update(vis)
      .subscribe(data => {
        console.log('Visibility updated - Service!');
        this
          .alertService
          .success('Visibility updated!');
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
    this.vis = new Visibility();
  }
  private findSelectedVisibilityIndex(vis:Visibility): number {
       return this.visibilities.indexOf(vis);
    }
}
