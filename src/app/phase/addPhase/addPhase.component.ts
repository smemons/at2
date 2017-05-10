import { CacheStoreService } from './../../services/cacheStore.service';
import { Wrapper } from './../../models/wrapper';
import { DDType } from './../../models/DDType.enum';
import { Router } from '@angular/router';
import { AlertService } from './../../services/alert.service';
import { PhaseService } from './../../services/phase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addPhase',
  templateUrl: './addPhase.component.html',
  styleUrls: ['./addPhase.component.css']
})
export class AddPhaseComponent implements OnInit {

   model : any = {};
  loading = false;
  constructor(private cache:CacheStoreService, private phaseService : PhaseService, private alertService : AlertService, private router : Router) {}

  ngOnInit() {}
  createPhase() {

    console.log(this.model);
    this.loading = true;
    this
      .phaseService
      .create(this.model)
      .subscribe(data => {
        let wrapper=new Wrapper(data.title,data._id,DDType.PHASE);
        this.cache.isDataCreated.next(wrapper);
        this
          .alertService
          .success('Phase created!');

          this.router.navigate(['/listPhases']);
      }, error => {

        console.log(error._body);
        this
          .alertService
          .error(error._body);
        this.loading = false;
      });

  }

}
