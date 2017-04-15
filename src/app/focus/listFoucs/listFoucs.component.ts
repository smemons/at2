import {
  ConfirmationService
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { Focus } from './../../models/focus';
import { FocusService } from './../../services/focus.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listFoucs',
  templateUrl: './listFoucs.component.html',
  styleUrls: ['./listFoucs.component.css']
})
export class ListFoucsComponent implements OnInit {

  focuses: Focus[];
  dialogVisible: boolean = false;
  focus: Focus;
  constructor(private focusService: FocusService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllFocuses()
      .subscribe({

        next: focus => this.focuses = focus
      });;
  }
  //get all focusegories
  getAllFocuses() {

    return this
      .focusService
      .getAll();
  }

  deleteFocus(focus) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .focusService
            .delete(focus._id)
            .subscribe(data => {
              console.log('Focus deteted - Service!');
              this
                .alertService
                .success('Focus deleted!');

              //remove form focusegories list too
              this.focuses.splice(this.findSelectedFocusIndex(focus),1);


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
  editFocus(focus: Focus) {
    this.dialogVisible = true;
    this.focus = focus;
  }
  //update Focus
  updateFocus(focus: Focus) {
    this
      .focusService
      .update(focus)
      .subscribe(data => {
        console.log('Focus updated - Service!');
        this
          .alertService
          .success('Focus updated!');
        this.dialogVisible = false;

      }, error => {

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
    this.focus = new Focus();
  }
  private findSelectedFocusIndex(focus:Focus): number {
       return this.focuses.indexOf(focus);
    }
}
