import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { FocusService } from './../../services/focus.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-addFocus',
  templateUrl: './addFocus.component.html',
  styleUrls: ['./addFocus.component.css']
})
export class AddFocusComponent implements OnInit {

   model : any = {};
  loading = false;
  constructor(private cd:ChangeDetectorRef,private focusService : FocusService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createFocus() {

    console.log(this.model);
    this.loading = true;
    this
      .focusService
      .create(this.model)
      .subscribe(data => {
        console.log('Focus created - Service!');
        this
          .alertService
          .success('Focus created!');
          this.cd.markForCheck();
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
