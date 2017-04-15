import { Category } from './../models/category';
import { Router } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { CategoryService } from '../services/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
    model: any = {};
    loading = false;
  constructor(private categoryService:CategoryService,private alertService:AlertService,
  private router:Router) { }

  ngOnInit() {
  }

  createCategory(){

    console.log(this.model);
        this.loading = true;
         this.categoryService.create(this.model)
            .subscribe(
                data => {
                   console.log('Category created - Service!');
                   this.alertService.success('Category created!');
                    this.router.navigate(['/home']);
                },
                error => {
                    //this.alertService.error(error);
                    console.log(error._body);
                    this.alertService.error(error._body);
                    this.loading = false;
                });

  }
}
