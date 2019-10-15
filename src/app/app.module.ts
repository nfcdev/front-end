import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckInFormComponent, CheckInFormDialogComponent } from './check-in-form/check-in-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { 
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    CheckInFormComponent,
    CheckInFormDialogComponent
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
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CheckInFormDialogComponent
  ]
})
export class AppModule { }
