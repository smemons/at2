import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class Userservice {
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  public token: string;
  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

  }

  getAll() {
    return this
      .http
      .get('/api/user/all', this.jwt())
      .map((response: Response) => response.json());
  }

  getById(id: number) {
    return this
      .http
      .get('/api/users/' + id, this.jwt())
      .map((response: Response) => response.json());
  }

  create(user: User) {
    console.log('posting user from service: ' + user);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/user', user, this.jwt())
      .map((response: Response) => response.json());
  }

  update(user: User) {
    return this
      .http
      .put('/api/user/' + user.username, user, this.jwt())
      .map((response: Response) => response.json());
  }

  delete(id: number) {
    return this
      .http
      .delete('/api/user/' + id, this.jwt())
      .map((response: Response) => response.json());
  }

  /**
   * Authenticate users
   *
   * @param {User} user
   * @returns
   *
   * @memberOf Userservice
   */
  authenticate(user: User) {

    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/user/authenticate', user, this.jwt())
      .map((response: Response) => {
        let token = response.json() && response
          .json()
          .token;
        if (token) {
          this.token = token;

          localStorage.setItem('currentUser', JSON.stringify({ 'username': user.username, 'token': token }));
          return true;
        } else {
          return false;
        }
      });
  }

  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Authorization': 'Bearer ' + currentUser.token
      });
      return new RequestOptions({ headers: headers });
    }
  }
}
