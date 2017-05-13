import { KPI } from './../../models/kpi';
import { AlertService } from './../../services/alert.service';
import { KpiService } from '../../services/kpi.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  ConfirmationService
} from 'primeng/primeng';
@Component({
  selector: 'app-listKpi',
  templateUrl: './listKpi.component.html',
  styleUrls: ['./listKpi.component.css']
})
export class ListKpiComponent implements OnInit {
 kpis: KPI[];
  dialogVisible: boolean = false;
  kpi: KPI;
  constructor(private kpiService: KpiService, private alertService: AlertService, private confirmationService: ConfirmationService) {}
  ngOnInit() {
    this
      .getAllKPIes()
      .subscribe({
        next: kpi => this.kpis = kpi
      });
  }
  //get all kpiegories
  getAllKPIes() {
    return this
      .kpiService
      .getAll();
  }
  deleteKPI(kpi) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this
            .kpiService
            .delete(kpi._id)
            .subscribe(data => {
              console.log('KPI deteted - Service!');
              this
                .alertService
                .success('KPI deleted!');
              //remove form kpiegories list too
              this.kpis.splice(this.findSelectedKPIIndex(kpi),1);
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
  editKPI(kpi: KPI) {
    this.dialogVisible = true;
    this.kpi = kpi;
  }
  //update KPI
  updateKPI(kpi: KPI) {
    this
      .kpiService
      .update(kpi)
      .subscribe(data => {
        console.log('KPI updated - Service!');
        this
          .alertService
          .success('KPI updated!');
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
    this.kpi = new KPI();
  }
  private findSelectedKPIIndex(kpi:KPI): number {
       return this.kpis.indexOf(kpi);
    }
}
