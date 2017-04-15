import { Category } from './../models/category';
import { AuthService } from './auth.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {

constructor(private http:Http,private authService: AuthService) { }

create(category:Category)
{

  category.createdBy=this.authService.getCurrentUser();
   console.log('posting Category from service: ' + category);
    //return this.http.post('/api/user', JSON.stringify(user), this.options);
    return this
      .http
      .post('/api/category', category)
      .map((response: Response) => response.json());
}
//get all Category
 getAll() {
    return this
      .http
      .get('/api/category/all')
      .map((response: Response) => response.json());
  }
//update Category
update(cat:Category)
{
  cat.createdBy=this.authService.getCurrentUser();
   console.log('putting/updating Category from service: ' + cat);

    return this
      .http
      .put('/api/category', cat)
      .map((response: Response) => response);
}
//delete
//update Category
delete(id:String)
{



    return this
      .http
      .delete('/api/category/'+id)
      .map((response: Response) => response);
}
}
