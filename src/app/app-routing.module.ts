import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AfterAuthGuard} from './guards/after-auth.guard';
import {LoginComponent} from './components/login/login.component';
import {ListPostComponent} from './components/post/list-post/list-post.component';
import {AddPostComponent} from './components/post/add-post/add-post.component';
import {EditPostComponent} from './components/post/edit-post/edit-post.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {RegisterComponent} from './components/register/register.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AfterAuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AfterAuthGuard]},
  {
    path: 'post', children: [
      {path: '', component: ListPostComponent},
      {path: 'create', component: AddPostComponent},
      {path: 'edit/:id', component: EditPostComponent}
    ], canActivate: [AuthGuard],
  },
  {path: '**', component: PageNotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
