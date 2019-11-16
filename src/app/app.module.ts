import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckInFormComponent, CheckInFormDialogComponent } from './check-in-form/check-in-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableArticleDataComponent } from './table-article-data/table-article-data.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { StorageEventFormComponent, StorageEventFormDialogComponent } from './storage-event-form/storage-event-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

import { MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { MainComponent } from './main/main.component';
import { UnauthorizedInterceptor } from './auth/unauthorized.interceptor';
import { AuthenticationService } from './auth/authService';

@NgModule({
  declarations: [
    AppComponent,
    TableArticleDataComponent,
    StorageEventFormComponent,
    StorageEventFormDialogComponent,
    CheckInFormComponent,
    CheckInFormDialogComponent,
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    AuthenticationService
  ],
  bootstrap: [AppComponent],
  entryComponents: [CheckInFormDialogComponent, StorageEventFormDialogComponent]
})
export class AppModule {}
