import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeBuilderService } from './services/treeBuilder.service';
import { StatusService } from './services/status.service';
import { UtilityService } from './services/utility.service';
import { PhaseService } from './services/phase.service';
import { FocusService } from './services/focus.service';
import { VisibilityService } from './services/visibility.service';
import { DeptService } from './services/dept.service';
import { TaskService } from './services/task.service';
import { ActivityService } from './services/activity.service';
import { CategoryService } from './services/category.service';
import { AuthGuard } from './services/authguard';
import { AuthService } from './services/auth.service';
import { Userservice } from './services/userservice.service';
import { AlertService } from './services/alert.service';
import { Routes } from '@angular/router/router';
import { TruncatePipe } from './services/truncate.pipe';
import { TaskComponent } from './task/task.component';
import { TreeComponent } from './activity/tree/tree.component';
import { ListStatusComponent } from './status/listStatus/listStatus.component';
import { AddStatusComponent } from './status/addStatus/addStatus.component';
import { ListPhaseComponent } from './phase/listPhase/listPhase.component';
import { AddPhaseComponent } from './phase/addPhase/addPhase.component';
import { ListFoucsComponent } from './focus/listFoucs/listFoucs.component';
import { AddFocusComponent } from './focus/addFocus/addFocus.component';
import { ListVisComponent } from './visibility/listVis/listVis.component';
import { AddVisComponent } from './visibility/addVis/addVis.component';
import { ListDeptComponent } from './dept/listDept/listDept.component';
import { AddDeptComponent } from './dept/addDept/addDept.component';
import { ViewActivityComponent } from './activity/viewActivity/viewActivity.component';
import { ListActivitiesComponent } from './activity/listActivities/listActivities.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActivityComponent } from './activity/addActivity/activity.component';
import { ListUsersComponent } from './listUsers/list-users.component';
import { ListCategoryComponent } from './category/listCategory/listCategory.component';
import { CategoryComponent } from './category/category.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { UserComponent } from './user/user.component';
import { ROUTES } from './routes';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {GrowlModule,ListboxModule,CalendarModule,PanelModule,DataTableModule,
  InputTextareaModule,InputTextModule,DialogModule,InputSwitchModule,
  ConfirmDialogModule,ConfirmationService,AutoCompleteModule,
  SelectButtonModule,SliderModule,MultiSelectModule,DropdownModule,
  FileUploadModule,TabViewModule,TreeModule} from 'primeng/primeng';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,
    UserComponent,
    AlertComponent,
    LoginComponent,
    CategoryComponent,
    ListCategoryComponent,
    ListUsersComponent,
    ActivityComponent,
    DashboardComponent,
    ListActivitiesComponent,
    ViewActivityComponent,
    AddDeptComponent,
    ListDeptComponent,
    AddVisComponent,
    ListVisComponent,
    AddFocusComponent,
    ListFoucsComponent,
    AddPhaseComponent,
    ListPhaseComponent,
    AddStatusComponent,
    ListStatusComponent,
    TreeComponent,
    TaskComponent,
    TruncatePipe

  ],
  imports: [
     BrowserModule,
    FormsModule,
    HttpModule,
    GrowlModule,
    ListboxModule,
    CalendarModule,
    PanelModule,
    DataTableModule,
    InputTextareaModule,
    InputTextModule,
    DialogModule,
    InputSwitchModule,

    ConfirmDialogModule,
    AutoCompleteModule,
    SelectButtonModule,
    SliderModule,
    MultiSelectModule,
    DropdownModule,
    FileUploadModule,
    TabViewModule,
    TreeModule,
    BrowserAnimationsModule,

    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AlertService,
    Userservice,
    AuthService,
    AuthGuard,
    CategoryService,
    ActivityService,
    TaskService,
    ConfirmationService,
    DeptService,
    VisibilityService,
    FocusService,
    PhaseService,
    UtilityService,
    StatusService,
    TreeBuilderService,
    TruncatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
