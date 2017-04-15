import { AlertService } from './../services/alert.service';
import { Component, OnInit } from '@angular/core';
import {Messages} from 'primeng/primeng';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  msgs: Messages[] = [];
  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => { this.msgs.push(message)});
  }

}
