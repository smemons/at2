import { User } from './../models/user';
import { Userservice } from './../services/userservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

users:User[];
  constructor(private userService: Userservice) { }

  ngOnInit() {
    this.getAllUsers().subscribe({
      next: users => {
        console.log("Got users: ", users);
        this.users=users;
      }
    });;
  }
  getAllUsers() {
    return this.userService.getAll();
  }
}
