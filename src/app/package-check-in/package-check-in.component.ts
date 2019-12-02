import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { ThrowStmt } from '@angular/compiler';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { StorageRoomStore } from '../storage-room/storage-room-store';
import { StorageRoomService } from '../storage-room/storage-room.service';
import { DataService } from "../data.service"
import { TableArticleDataItem } from '../table-article-data/table-article-data-datasource'


export interface DialogData {
  package: string;
  reference_number: number;
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
  selection : any[];
  packages: string[];
  preChosen = false;

  storage_room: String;
  branch: String;

  packageInfo: PackageInfo[];




  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog,
    private storageRoomStore: StorageRoomStore,
    private storageRoomService: StorageRoomService,) { }

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

      }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if (result != null) { // if user presses cancel the result is null. We get here from the 'Tillbaka' button
        //console.log(result);

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
      this.packages = this.selection.reduce((a, {package_number}) => a.concat(package_number), []);
    });
    if (this.packages == undefined){
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
  packageNotFound : boolean = false;
  checkInPackageForm: FormGroup;
  storage_room_id: Number;
  branch_id: Number;

  shelves: Shelf[];
  materials: TableArticleDataItem[] = [];

  packages: string[];

  filteredOptions: Observable<PackageInfo[]>;

  duplicatePackages: Duplicate[] = [];

  hasDuplicate = false;



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
    this.dataService.sendGetRequest("/shelf/storageroom/" + this.storage_room_id).subscribe((data: any[])=>{
      var tmp_shelves = []
      for (var d of data) {
        var tmp: Shelf = {"shelfName": d.shelf_name,
                          "shelfId": d.id}
        tmp_shelves.push(tmp);
      }
      this.shelves = tmp_shelves;
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
      //reference_number: ['', Validators.required],
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

  onCheckOut() : void {
    let hasDuplicate = false;


    this.data.packageMaterials.forEach( (val, key, arr )=> {
      this.dataService.sendGetRequest('/article?package_number=' + val).subscribe( (data: any []) => {

        if(data[0].status === 'checked_in'){

          let temp: Duplicate = {package_number: val, storage_room: data[0].storage_room};
          this.duplicatePackages.push(temp);
          hasDuplicate = true;

          

        }

        if(hasDuplicate){
          this.hasDuplicate = hasDuplicate;

        } else if (!hasDuplicate && Object.is(arr.length - 1, key)) {

          this.onConfirm();
        }
      });
      
    });
    

    
    
  }

  onCancelDuplicate () : void {
    this.duplicatePackages = [];
    this.hasDuplicate = false;
    
  }


  onConfirm(): void {
    this.checkOutConfirmed = true;
    // TODO: check out the package to the back end here.
    // fields: data.package, data.storage_room, data.area (branch), data.shelf, data.comment

    //For check in of existing items
   for (var pg of this.data.packageMaterials) {
    var post_data = {"package_number": pg,
                    "storage_room": this.storage_room_id,
                    "shelf": this.data.shelf.shelfId
                    };
      
      //If comment is added then add it to data for post-request
      if (this.data.comment !== "" && this.data.comment !== null) {
        post_data["comment"] = this.data.comment;
      }
      this.dataService.sendPostRequest("/package/check-in", post_data).subscribe((data: any[])=>{
      })

    }
  }

  getShelfId(chosenShelfName) : number {
    for (var shelf of this.shelves) {
      if (chosenShelfName === shelf.shelfName) {
        return shelf.shelfId;
      }
    }
  }

  addPackage(newPackage : string) : void {
    if (!this.data.packageMaterials.includes(newPackage)) {
      if(newPackage && newPackage.length > 0) {
        this.data.packageMaterials.push(newPackage);
        this.checkInPackageForm.controls['package'].reset()
        this.addMaterials();
      }
    } else {
      // duplicate
    }
  }

  addMaterials() {
    for (var pg of this.data.packageMaterials){
      this.dataService.sendGetRequest("/package/package_number/" + pg).subscribe((data: Package)=>{
        this.dataService.sendGetRequest("/article/package/" + data.id).subscribe((material_data: TableArticleDataItem[])=>{
          for (var mat of material_data) {
            this.materials.push(mat);
          }
        })
      })
    }
  }

  removePackage(pg : string ) : void {
    this.data.packageMaterials.forEach((item, index) => {
      if (item === pg) this.data.packageMaterials.splice(index, 1);
    });
    this.materials = [];
    this.addMaterials();
  }




}
