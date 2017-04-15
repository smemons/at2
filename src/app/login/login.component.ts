import { AuthService } from './../services/auth.service';
import { Userservice } from './../services/userservice.service';
import { AlertService } from './../services/alert.service';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userservice: Userservice,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    //this.authService.logout();
    this.authService.isUserLoggedin = false;

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    //user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.redirectUrl]);
    }
    else {
      this.loading = true;


      this.authService.authenticate(this.model)
        .subscribe(
        data => {

          if (data) {
            //user has logged in successfully - set him into session storage for now


            this.router.navigate([this.authService.redirectUrl]);
          }
          else {
            this.loading = false;
            this.router.navigate(['/login']);
          }


        },
        error => {


          this.alertService.error(error.body);
          this.loading = false;
        });
    }
  }

  //logout
  logout() {
    this.authService.logout();
  }
}
