import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { StorageRoomService } from "../storage-room/storage-room.service";
import { DataService } from '../data.service';
import {
  StorageRoomStore
} from "../storage-room/storage-room-store";
import { TableArticleDataItem } from '../table-article-data/table-article-data-datasource';
import { TableDataService } from '../table-article-data/table-data-service';

export interface DialogData {
  selectedPackages: string[];
  preSelected: boolean;
  comment: string;
}
@Component({
  selector: 'app-check-out-preselected',
  templateUrl: './check-out-preselected.component.html',
  styleUrls: ['./check-out-preselected.component.less']
})
export class CheckOutPreselectedComponent implements OnInit {
  packageExists: boolean = true;
  selection: any[];
  packages: string[];
  preChosen = false;
  constructor(private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog,
    private tableDataService: TableDataService) { }




  openDialog(): void {

    console.log(this.packages)
    const dialogRef = this.dialog.open(CheckOutPreselectedDialogComponent, {
      width: '800px',
      height: '400px',
      data:
      {
        selectedPackages: this.packages,
        preChosen: this.preChosen,
      }
    });
    console.log(this.packageExists)

    dialogRef.afterClosed().subscribe(result => {
      this.tableDataService.resetSelection();
      this.tableDataService.refreshData();
      this.packages = []
      this.preChosen = false;
      console.log('The dialog was closed');
      if (result != null) {
      } else {
        console.log('Empty result');
      }
    });
  }
  ngOnInit() {
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.packages = this.selection.reduce((a, { package_number }) => a.concat(package_number), []);
      if (this.packages.includes(" - ")) {
        this.packageExists = false;
      } else {
        this.packageExists = true;
      }

    });

    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      if ((this.packages && this.packages.length > 0)) {
        this.preChosen = true;
      } else {
        this.preChosen = false;
      }
    });


  }
}
@Component({
  selector: 'app-check-out-preselected-dialog',
  templateUrl: 'check-out-preselected-dialog.html',
  providers: [StorageRoomService]
})
export class CheckOutPreselectedDialogComponent implements OnInit {
  checkOutConfirmed: boolean = false;
  preChosen: boolean = false;
  comment: String;
  selectedStorageRoomId: Number;

  checkOutError: boolean = false;
  failedPackages: string[] = [];
  successfulPackages: string[] = [];
  errorStrings: string[] = [];


  constructor(
    public dialogRef: MatDialogRef<CheckOutPreselectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private storageRoomStore: StorageRoomStore,
    private dataService: DataService) { }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  onConfirm(): void {
    this.selectedStorageRoomId = this.storageRoomStore.getStorageRoom().id;
    this.checkOutConfirmed = true;
    console.log(this.comment);

    //For check in of existing items
    for (var package_nr of this.data.selectedPackages) {
      const tmpPackage = package_nr;
      var post_data = {
        "package_number": tmpPackage,
        "comment": this.comment,
        "storage_room": this.selectedStorageRoomId
      };
      //If comment is added then add it to data for post-request
      if (this.comment !== "" && this.data.selectedPackages !== null) {
        post_data["comment"] = this.comment;
      } else {
        post_data["comment"] = ""
      }
      //If package is added then add it to data for post-request
      if (this.data.selectedPackages !== undefined) {
        post_data["package"] = this.data.selectedPackages;
        //post_data["storage_room"] = this.
      }

      this.dataService.sendPostRequest("/package/check-out", post_data).subscribe(
        (data: any[]) => {
          this.packageSuccess(tmpPackage);
        },
        (err => {
          this.packageFailure(tmpPackage, err);
        })
      )

    }

  }

  packageSuccess(successfulPackage: string): void {
    this.checkOutConfirmed = true;
    this.successfulPackages.push(successfulPackage);
  }

  packageFailure(failedPackage: string, error: string): void {
    this.checkOutError = true;
    this.errorStrings.push(error);
    this.failedPackages.push(failedPackage);
  }

  ngOnInit(): void {

  }



}