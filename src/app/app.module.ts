import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  CheckInFormComponent,
  CheckInFormDialogComponent
} from "./check-in-form/check-in-form.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TableArticleDataComponent } from "./table-article-data/table-article-data.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import {
  StorageEventFormComponent,
  StorageEventFormDialogComponent
} from "./storage-event-form/storage-event-form.component";
import {
  MaterialCheckInComponent,
  MaterialCheckInDialogComponent
} from "./material-check-in/material-check-in.component";

import { DataVisualizationDialogComponent } from "./data-visualization/data-visualization.component";
import { MatDialogModule } from "@angular/material";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";

import { StorageRoomStore } from "./storage-room/storage-room-store";

import { BranchStore } from "./branch/branch-store";

import { LoginComponent } from "./login/login.component";

import { CheckInDropDownComponent } from "./check-in-drop-down/check-in-drop-down.component";
import {
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatGridListModule,
  MatMenuModule,
  MatListModule,
  MatChipsModule,
  MatExpansionModule,
  MatAutocompleteModule
} from "@angular/material";
import { MainComponent } from "./main/main.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { UnauthorizedInterceptor } from "./auth/unauthorized.interceptor";
import { AuthenticationService } from "./auth/authService";
import {
  MaterialPageComponent,
  MaterialPageDialogComponent
} from "./material-page/material-page.component";
import {
  PackagePageComponent,
  PackagePageDialogComponent
} from "./package-page/package-page.component";
import {
  ShelfPageComponent,
  ShelfPageDialogComponent
} from "./shelf-page/shelf-page.component";
import { ManageSystemComponent } from "./manage-system/manage-system.component";
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { DataVisualizationComponent } from "./data-visualization/data-visualization.component";
import {
  ManageSystemDialogComponent,
  ManageSystemDialogPopupComponent
} from "./manage-system/manage-system-dialog/manage-system-dialog.component";

import {
  MaterialCheckOutComponent,
  MaterialCheckOutDialogComponent
} from "./material-check-out/material-check-out.component";

import { MaterialCheckBoxService } from "./table-article-data/material-check-box.service";
import {
  PackageCheckInComponent,
  PackageCheckInDialogComponent
} from "./package-check-in/package-check-in.component";
import { RoomAndBranchNameComponent } from "./room-and-branch-name/room-and-branch-name.component";
import {
  UserPageComponent,
  UserPageDialogComponent
} from "./user-page/user-page.component";
import {
  PackageCheckOutComponent,
  PackageCheckOutDialogComponent
} from "./package-check-out/package-check-out.component";

@NgModule({
  declarations: [
    AppComponent,
    TableArticleDataComponent,
    StorageEventFormComponent,
    StorageEventFormDialogComponent,
    CheckInFormComponent,
    CheckInFormDialogComponent,
    LoginComponent,
    MainComponent,
    SearchBarComponent,
    ManageSystemComponent,
    CheckInDropDownComponent,
    MaterialPageComponent,
    MaterialPageDialogComponent,
    PackagePageComponent,
    PackagePageDialogComponent,
    ShelfPageComponent,
    ShelfPageDialogComponent,
    ManageSystemDialogComponent,
    ManageSystemDialogPopupComponent,
    MaterialCheckOutComponent,
    MaterialCheckOutDialogComponent,
    MaterialCheckInComponent,
    MaterialCheckInDialogComponent,
    DataVisualizationComponent,
    DataVisualizationDialogComponent,
    PackageCheckInComponent,
    PackageCheckInDialogComponent,
    RoomAndBranchNameComponent,
    UserPageComponent,
    UserPageDialogComponent,
    PackageCheckOutComponent,
    PackageCheckOutDialogComponent
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
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    CdkTableModule,
    CdkTreeModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    NgbAlertModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    AuthenticationService,
    StorageRoomStore,
    BranchStore,
    MaterialCheckBoxService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CheckInFormDialogComponent,
    StorageEventFormDialogComponent,
    MaterialPageDialogComponent,
    PackagePageDialogComponent,
    ShelfPageDialogComponent,
    ManageSystemDialogPopupComponent,
    MaterialCheckOutDialogComponent,
    MaterialCheckInDialogComponent,
    DataVisualizationDialogComponent,
    PackageCheckInDialogComponent,
    UserPageDialogComponent,
    PackageCheckOutDialogComponent
  ]
})
export class AppModule {}
