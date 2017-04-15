import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
  isCollapsed = true;

constructor( private authService: AuthService) {

  }
 isUserLoggedIn(): boolean {
     return this.authService.isUserLoggedin;
  }

logout(event) {
    this.authService.logout();
  }


}
