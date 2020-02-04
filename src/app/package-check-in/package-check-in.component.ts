import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StorageRoomStore } from '../storage-room/storage-room-store';
import { StorageRoomService } from '../storage-room/storage-room.service';
import { DataService } from "../data.service"
import { TableArticleDataItem } from '../table-article-data/table-article-data-datasource'
import { HttpHeaderResponse } from '@angular/common/http';
import { TableDataService } from '../table-article-data/table-data-service';
export interface DialogData {
  package: string;
  reference_number: string;
  packageMaterials: string[];
  area: string;
  storage_room: string;
  shelf: Shelf;
  comment: string;
  packageInfo: PackageInfo[];
  packages: string[];
}
export interface Package {
  id: number,
  package_number: String,
  shelf: number,
  case: number,
  current_storage_room: number
}
export interface Room {
  roomName: string;
  roomId: number;
}
export interface Area {
  areaName: string;
  areaId: number;
}
export interface Shelf {
  shelfName: String;
  shelfId: number;
}

export interface Case {
  reference_number: String;
  id: number;
}
export interface DialogData {
  package: string;
  packageMaterials: string[];
  preChosen: boolean;
}
export interface PackageInfo {
  name: string;
  packageMaterials: string[];
  reference_number: number;
}
@Component({
  selector: 'app-package-check-in',
  templateUrl: './package-check-in.component.html',
  styleUrls: ['./package-check-in.component.less']
})
export class PackageCheckInComponent implements OnInit {
  given_storage_room_id: number;
  given_area_id: number;
  selection: any[];
  packages: string[];
  preChosen = false;

  reference_number: string;
  storage_room: String;
  branch: String;

  packageInfo: PackageInfo[];
  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog,
    private storageRoomStore: StorageRoomStore,
    private storageRoomService: StorageRoomService,
    private tableDataService: TableDataService) { }
  openDialog(): void {
    // TODO: Get information about the material from the back end here and then send it to the dialog
    this.given_storage_room_id = 1; //TODO: Get storage room ID here
    this.given_area_id = 1; //TODO: Get area id here

    // if((this.materials && this.materials.length > 0)){
    //   this.preChosen= true;
    // } else {
    //   this.preChosen = false;
    //   this.materials = [] as string[];
    // }
    const dialogRef = this.dialog.open(PackageCheckInDialogComponent, {
      width: '500px',
      // send in data to form to be filled automatically TODO: send in room computer is in
      data:
      {
        area: this.branch,
        storage_room: this.storage_room,
        preChosen: this.preChosen,
        packageMaterials: this.packages,
        packageInfo: this.packageInfo,
        reference_number: this.reference_number,

      }
    });
    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {
      this.tableDataService.resetSelection();
      //this.tableDataService.refreshData();
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
    this.storageRoomStore.currentStorageRoom.subscribe(currentRoom => {
      this.storageRoomService
        .getBranchNameForStorageRoom(currentRoom)
        .subscribe(branchName => {
          this.branch = branchName;
          this.storage_room = currentRoom.name;
        });
    });
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.packages = this.selection.reduce((a, { package_number }) => a.concat(package_number), []);
      if (this.packages != undefined) {
        this.preChosen = true;
      }
    });
    if (this.packages == undefined) {
      this.packages = [];
    }
    
  }
}
export interface Duplicate {
  package_number: String;
  storage_room: String;
}
@Component({
  selector: 'app-package-check-in-dialog',
  templateUrl: './package-check-in-dialog.component.html',
})
export class PackageCheckInDialogComponent implements OnInit {
  checkOutConfirmed: boolean = false;
  packageNotFound: boolean = false;
  checkInPackageForm: FormGroup;
  storage_room_id: Number;
  branch_id: Number;
  reference_number: string;
  hasReference: boolean = false;
  hasPackage: boolean = false;
  newPackage: string;

  shelves: Shelf[] = [{ "shelfName": "", "shelfId": 0 }];
  materials: TableArticleDataItem[] = [];
  packages: string[];
  filteredOptions: Observable<PackageInfo[]>;
  duplicatePackages: Duplicate[] = [];
  hasDuplicate = false;

  checkInError: boolean = false;
  failedPackages: string[] = [];
  successfulPackages: string[] = [];
  errorStrings: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<PackageCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private storageRoomStore: StorageRoomStore,
    private fb: FormBuilder) {
    this.storageRoomStore.currentStorageRoom.subscribe(currentRoom => {
      this.branch_id = currentRoom.branch;
      this.storage_room_id = currentRoom.id;
    });
    //Get the shelves that belong to the current storage room
    this.dataService.sendGetRequest("/shelf/storageroom/" + this.storage_room_id).subscribe((data: any[]) => {
      var tmp_shelves = []
      for (var d of data) {
        var tmp: Shelf = {
          "shelfName": d.shelf_name,
          "shelfId": d.id
        }
        this.shelves.push(tmp);
      }
    })

    this.createForm();
  }
  ngOnInit() {
    this.filteredOptions = this.checkInPackageForm.get('package').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.data.packageInfo.slice())
      );
    this.addMaterials()
    this.addReferenceNumber();
    if (this.data.preChosen) {
      this.hasPackage = true;
    }


  }
  private _filter(name: string): PackageInfo[] {
    const filterValue = name.toLowerCase();
    return this.data.packageInfo.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  createForm() {
    // create variables and validators for form fields
    this.checkInPackageForm = this.fb.group({
      package: [''],
      //material_number: ['', Validators.required],
      reference_number: [''],
      area: [{ value: '', disabled: true }],
      storage_room: [{ value: '', disabled: true }],
      shelf: ['', Validators.required],
      comment: ['']
    });
  }
  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }
  // Runs when the back arrow button is clicked
  onBackButton(): void {
    this.dialogRef.close();
  }
  onCheckOut(): void {


    if (!this.hasReference) {
      let hasDuplicate = false;
      this.data.packageMaterials.forEach((val, key, arr) => {
        this.dataService.sendGetRequest('/article?package_number=' + val).subscribe((data: any[]) => {
          if (data[0].status === 'checked_in' && data[0].id !== '-') {
            console.log("HAS DUPLICATE", data[0]);

            let temp: Duplicate = { package_number: val, storage_room: data[0].storage_room };
            this.duplicatePackages.push(temp);
            hasDuplicate = true;

          }
          if (hasDuplicate) {

            this.hasDuplicate = hasDuplicate;
          } else if (!hasDuplicate && Object.is(arr.length - 1, key)) {
            this.onConfirm();
          }
        });

      });
    } else {
      this.onConfirm();
    }



  }
  onCancelDuplicate(): void {
    this.duplicatePackages = [];
    this.hasDuplicate = false;

  }

  checkInPackage(pg) {
    const tmpPackage = pg;
    var post_data = {
      "package_number": tmpPackage,
      "storage_room": this.storage_room_id,
      "shelf": this.data.shelf.shelfId
    };
    //If comment is added then add it to data for post-request
    if (this.data.comment !== "" && this.data.comment !== null) {
      post_data["comment"] = this.data.comment;
    }
    this.dataService.sendPostRequest("/package/check-in", post_data).subscribe(
      (data: any[]) => {
        this.packageSuccess(tmpPackage);
      },
      (err => {
        this.packageFailure(tmpPackage, err);
      }))
  }
  async onConfirm() {
    this.checkOutConfirmed = true;

    if (this.hasPackage) {
      for (var pg of this.data.packageMaterials) {
        await this.checkInPackage(pg);
      }
    } else if (this.hasReference) {
      //If a new package is to be created
      var package_post_data = {
        "reference_number": this.reference_number,
        "current_storage_room": this.storage_room_id,
        "shelf": this.data.shelf.shelfId
      };


      this.dataService.sendPostRequest("/package", package_post_data).subscribe((data: any[]) => {
        this.dataService.sendGetRequest("/package").subscribe(
          (data: any[]) => {
            this.newPackage = data[(data.length - 1)].package_number;
            this.packageSuccess(this.newPackage);
          },
          (err => {
            this.packageFailure("Nytt paket", err);
          }))
      })
    }
  }


  packageSuccess(successfulPackage: string): void {
    this.checkOutConfirmed = true;
    this.successfulPackages.push(successfulPackage);
  }

  packageFailure(failedPackage: string, error: string): void {
    this.checkInError = true;
    this.errorStrings.push(error);
    this.failedPackages.push(failedPackage);
  }


  getShelfId(chosenShelfName): number {
    for (var shelf of this.shelves) {
      if (chosenShelfName === shelf.shelfName) {
        return shelf.shelfId;
      }
    }
  }
  addPackage(newPackage: string): void {
    if (!this.data.packageMaterials.includes(newPackage)) {
      if (newPackage && newPackage.length > 0) {
        this.data.packageMaterials.push(newPackage);
        this.checkInPackageForm.controls['package'].reset()
        this.addMaterials();
        this.addReferenceNumber();
        this.hasPackage = true;
      }
    } else {
      // duplicate
    }
  }

  addNewPackage(reference: string): void {
    this.reference_number = reference;
    this.hasReference = true;
  }

  addReferenceNumber() {
    this.data.reference_number = "";
    for (var pg of this.data.packageMaterials) {
      
      this.dataService.sendGetRequest("/package/package_number/" + pg).subscribe((data: Package) => {
        console.log(data.case);
        this.dataService.sendGetRequest("/case/" + data.case).subscribe((case_data: Case) => {
          this.data.reference_number = case_data[0].reference_number;
       })
      })
    }
  }
  addMaterials() {
    for (var pg of this.data.packageMaterials) {
      this.dataService.sendGetRequest("/package/package_number/" + pg).subscribe((data: Package) => {
        this.dataService.sendGetRequest("/article/package/" + data.id).subscribe((material_data: TableArticleDataItem[]) => {
          for (var mat of material_data) {
            this.materials.push(mat);
          }
        })
      })
    }
  }
  removePackage(pg: string): void {
    this.data.packageMaterials.forEach((item, index) => {
      if (item === pg) this.data.packageMaterials.splice(index, 1);
    });
    this.materials = [];
    this.addMaterials();
    this.addReferenceNumber();
  }
}