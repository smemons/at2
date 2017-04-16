import { CacheStoreService } from '../../services/cacheStore.service';
import { Wrapper } from './../../models/wrapper';
import { DDType } from './../../models/DDType.enum';
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
  constructor(private cache:CacheStoreService ,private focusService : FocusService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createFocus() {

    console.log(this.model);
    this.loading = true;
    this
      .focusService
      .create(this.model)
      .subscribe(data => {
       let wrapper=new Wrapper(data.title,data._id,DDType.FOCUS);
       this.cache.isDataCreated.next(wrapper);
        this
          .alertService
          .success('Focus created!');

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
