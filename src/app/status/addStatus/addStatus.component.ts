
import { StatusService } from './../../services/status.service';
import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addStatus',
  templateUrl: './addStatus.component.html',
  styleUrls: ['./addStatus.component.css']
})
export class AddStatusComponent implements OnInit {

   model : any = {};
  loading = false;

  constructor(private statusService : StatusService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createStatus() {
    debugger;
    console.log(this.model);
    this.loading = true;
    this
      .statusService
      .create(this.model)
      .subscribe(data => {
        //statu changed - notify all subscriber
        this.statusService.isStatusChanged.next(true);
        console.log('Status created - Service!');
        this
          .alertService
          .success('Status created!');

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
