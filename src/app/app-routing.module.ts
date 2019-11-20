import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import{CheckInDublcateComponent} from './check-in-dublcate/check-in-dublcate.component';
import { TableArticleDataComponent } from './table-article-data/table-article-data.component'
import {CheckInFormComponent} from './check-in-form/check-in-form.component';
import {CheckInDropDownComponent} from './check-in-drop-down/check-in-drop-down.component';

const routes: Routes = [
  { path: '', component: CheckInDublcateComponent }, // Sets the starting page to login
  { path: 'main', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
