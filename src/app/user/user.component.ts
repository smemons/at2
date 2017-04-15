import { Userservice } from './../services/userservice.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    model: any = {};
    loading = false;
    roles: SelectItem[];
  selectedRoles: string[];


  constructor(private alertService:AlertService,private router:Router,private userService:Userservice) { }

  ngOnInit() {
    this.roles = [];
        this.roles.push({label:'Viewer', value:'VIEWER'});
        this.roles.push({label:'Writer', value:'WRITER'});
        this.roles.push({label:'Manager', value:'MANAGER'});
        this.roles.push({label:'Vice President', value:'VP'});
        this.roles.push({label:'Administrator', value:'ADMIN'});
  }

 register() {
      console.log(this.model);
        this.loading = true;
         this.userService.create(this.model)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page

                   console.log('User created - Service!');
                   this.alertService.success('User created!');
                    this.router.navigate(['/home']);
                },
                error => {
                    this.alertService.error(error);
                    console.log(error);
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }
}
