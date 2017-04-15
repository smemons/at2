import { ListStatusComponent } from './status/listStatus/listStatus.component';
import { AddStatusComponent } from './status/addStatus/addStatus.component';
import { ActivityComponent } from './activity/addActivity/activity.component';
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
import { ListUsersComponent } from './listUsers/list-users.component';
import { ListCategoryComponent } from './category/listCategory/listCategory.component';
import { CategoryComponent } from './category/category.component';
import { AuthGuard } from './services/authguard';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';
import { HomeComponent } from './home/home.component';
export const ROUTES = [
   {
        path: 'addStatus',
        component:AddStatusComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listStatuses',
        component:ListStatusComponent,
         canActivate: [AuthGuard]
    },
  {
        path: 'addPhase',
        component:AddPhaseComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listPhases',
        component:ListPhaseComponent,
         canActivate: [AuthGuard]
    },
  {
        path: 'addFocus',
        component:AddFocusComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listFocuses',
        component:ListFoucsComponent,
         canActivate: [AuthGuard]
    },

  {
        path: 'addVisibility',
        component:AddVisComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listVisibility',
        component:ListVisComponent,
         canActivate: [AuthGuard]
    },
   {
        path: 'addDept',
        component:AddDeptComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listDept',
        component:ListDeptComponent,
         canActivate: [AuthGuard]
    },
    {
      path: 'viewActivity/:id',
      component: ViewActivityComponent,
       canActivate: [AuthGuard]

    },
    {
        path: 'dashboard',
        component:DashboardComponent,
         canActivate: [AuthGuard]
    },
     {
        path: 'addChildActivity',
        component:ActivityComponent,
         canActivate: [AuthGuard]
    },
   {
        path: 'createActivity',
        component:ActivityComponent,
         canActivate: [AuthGuard]
    },
    {
        path: 'listActivities',
        component:ListActivitiesComponent,
         canActivate: [AuthGuard]
    },
     {
        path: 'listActivities',
        component:ActivityComponent,
         canActivate: [AuthGuard]
    },
  {
        path: 'listUsers',
        component:ListUsersComponent,
         canActivate: [AuthGuard]
    },
      {
        path: 'addCategory',
        component: CategoryComponent,
         canActivate: [AuthGuard]
    },
     {
        path: 'listCategories',
        component: ListCategoryComponent,
         canActivate: [AuthGuard]
    },

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'home',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'register',
        component: UserComponent

    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }

]
