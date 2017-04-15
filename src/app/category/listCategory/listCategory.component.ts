
import {
  ConfirmationService
} from 'primeng/primeng';
import {
  AlertService
} from '../../services/alert.service';
import {
  Category
} from './../../models/category';
import {
  CategoryService
} from '../../services/category.service';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-listCategory',
  templateUrl: './listCategory.component.html',
  styleUrls: ['./listCategory.component.css']
})
export class ListCategoryComponent implements OnInit {

  categories: Category[];
  dialogVisible: boolean = false;
  category: Category;
  constructor(private categoryService: CategoryService, private alertService: AlertService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this
      .getAllCategories()
      .subscribe({

        next: cat => this.categories = cat
      });;
  }
  //get all categories
  getAllCategories() {

    return this
      .categoryService
      .getAll();
  }

  deleteCat(cat) {
    this
      .confirmationService
      .confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {

          this
            .categoryService
            .delete(cat._id)
            .subscribe(data => {
              console.log('Category deteted - Service!');
              this
                .alertService
                .success('Category deleted!');

              //remove form categories list too
              this.categories.splice(this.findSelectedCatIndex(cat),1);


            }, error => {
              //this.alertService.error(error);
              console.log(error);
              this
                .alertService
                .error(error);

            });
        }
      });
  }
  editCat(cat: Category) {
    this.dialogVisible = true;
    this.category = cat;
  }
  //update Category
  updateCategory(cat: Category) {
    this
      .categoryService
      .update(cat)
      .subscribe(data => {
        console.log('Category updated - Service!');
        this
          .alertService
          .success('Category updated!');
        this.dialogVisible = false;

      }, error => {
        //this.alertService.error(error);
        console.log(error);
        this
          .alertService
          .error(error);
        this.dialogVisible = false;
      });
  }

  //cancel
  cancel() {
    this.dialogVisible = false;
    this.category = new Category();
  }
  private findSelectedCatIndex(cat:Category): number {
       return this.categories.indexOf(cat);
    }
}
