import { CacheStoreService } from './../../services/cacheStore.service';
import { Wrapper } from './../../models/wrapper';
import { DDType } from './../../models/DDType.enum';
import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { VisibilityService } from './../../services/visibility.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addVis',
  templateUrl: './addVis.component.html',
  styleUrls: ['./addVis.component.css']
})
export class AddVisComponent implements OnInit {

   model : any = {};
  loading = false;
  constructor(private cache:CacheStoreService,private visibilityService : VisibilityService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createVisibility() {

    console.log(this.model);
    this.loading = true;
    this
      .visibilityService
      .create(this.model)
      .subscribe(data => {
        let wrapper=new Wrapper(data.title,data._id,DDType.VISIBILITY);
        this.cache.isDataCreated.next(wrapper);
        this
          .alertService
          .success('Visibility created!');
          //go back to where you came from
          this.router.navigate(['/listVisibility']);
      }, error => {

        console.log(error._body);
        this
          .alertService
          .error(error._body);
        this.loading = false;
      });

  }

}
