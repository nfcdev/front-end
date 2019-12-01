import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import{CheckOutPreselectedComponent} from './check-out-preselected/check-out-preselected.component';
import { TableArticleDataComponent } from './table-article-data/table-article-data.component'
import { VisualisationMainComponent } from './visualisation-main/visualisation-main.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, // Sets the starting page to login
  { path: 'main', component: MainComponent },
  { path: 'check', component: CheckOutPreselectedComponent},
  { path: 'visualisation', component: VisualisationMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
