import {
  ConfirmationService
} from 'primeng/primeng';
import { AlertService } from './../../services/alert.service';
import { PhaseService } from './../../services/phase.service';
import { Phase } from './../../models/phase';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listPhase',
  templateUrl: './listPhase.component.html',
  styleUrls: ['./listPhase.component.css']
})
export class ListPhaseComponent implements OnInit {

 phases: Phase[];
  dialogVisible: boolean = false;
  phase: Phase;
  constructor(private phaseService: PhaseService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllPhasees()
      .subscribe({

        next: phase => this.phases = phase
      });;
  }
  //get all phaseegories
  getAllPhasees() {

    return this
      .phaseService
      .getAll();
  }

  deletePhase(phase) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .phaseService
            .delete(phase._id)
            .subscribe(data => {
              console.log('Phase deteted - Service!');
              this
                .alertService
                .success('Phase deleted!');

              //remove form phaseegories list too
              this.phases.splice(this.findSelectedPhaseIndex(phase),1);


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
  editPhase(phase: Phase) {
    this.dialogVisible = true;
    this.phase = phase;
  }
  //update Phase
  updatePhase(phase: Phase) {
    this
      .phaseService
      .update(phase)
      .subscribe(data => {
        console.log('Phase updated - Service!');
        this
          .alertService
          .success('Phase updated!');
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
    this.phase = new Phase();
  }
  private findSelectedPhaseIndex(phase:Phase): number {
       return this.phases.indexOf(phase);
    }
}
