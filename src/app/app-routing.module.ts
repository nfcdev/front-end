import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';

import { TableArticleDataComponent } from './table-article-data/table-article-data.component'

const routes: Routes = [
  { path: '', component: LoginComponent }, // Sets the starting page to login
  { path: 'main', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
