import {
  Router
} from '@angular/router';
import {
  AlertService
} from './alert.service';
import {
  Http,
  Response,
  Headers,
  RequestOptions
} from '@angular/http';
import {
  User
} from './../models/user';
import {
  Injectable
} from '@angular/core';

@Injectable()
export class AuthService {

  isUserLoggedin: boolean = false;

  redirectUrl: string = '/';

  public token: string;
  constructor(private http: Http, private alertService: AlertService, private router: Router) {
    var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

  }

  authenticate(usr: User) {

   usr.username=usr.username.toLowerCase();
   usr.password=usr.password.toLowerCase();
    return this
      .http
      .post('/api/user/authenticate', usr, this.jwt())
      .map((response: Response) => {

          console.log(response.json());
          var obj = response.json();
          if (obj.success) {
            this.isUserLoggedin = true;
            sessionStorage.setItem('currentUser', JSON.stringify({
              'username': usr.username
            }));
            this.alertService.success(obj.message);
            return true;
          } else {

            this.alertService.error(obj.message);
            return false;
          }
        }


      );
  }

  //logout
  logout() {
    this.isUserLoggedin = false;
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("incident");
    sessionStorage.removeItem("room");
    this.alertService.success('User logged out successfully!');
    this.router.navigate(['/']);
  }
  isLoggedIn(): boolean {
    if(this.isUserLoggedin)
    {
      return true;
    }
    else
    {
      if(sessionStorage.getItem('currentUser')){
        this.isUserLoggedin=true;
        return true;
      }
    }
    return false;
  }

  //get current User
  getCurrentUser(): string {
    if (this.isUserLoggedin)
      return JSON.parse(sessionStorage.getItem('currentUser')).username;
    return "";
  }
  

  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Authorization': 'Bearer ' + currentUser.token
      });
      return new RequestOptions({
        headers: headers
      });
    }
  }
}
