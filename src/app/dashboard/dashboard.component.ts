import { Router } from '@angular/router';

import {  Component, OnInit } from '@angular/core';
declare var moment: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(
        private router: Router) {

    }

    handleChange(e) {
        let index = e.index;
        let link;
        switch (index) {
            // case 0:
            //     link = ['/exview'];
            //     break;
            // case 1:
            //     link = ['/myview'];
            //     break;
            case 2:
                link = ['/hrchview'];
                this.router.navigate(link);
                break;
        }

    }

}
