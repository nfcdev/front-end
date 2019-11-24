import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { ThrowStmt } from '@angular/compiler';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface DialogData {
  package: string;
  reference_number: number;
  packageMaterials: string[];
  area: string;
  storage_room: string;
  shelf: string;
  comment: string;
  packageInfo: PackageInfo[];
  packages: string[];
}

export interface Room {
  roomName: string;
  roomId: number;
}
export interface Area {
  areaName: string;
  areaId: number;
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

  materials: string[];
  preChosen = false;

  packageInfo: PackageInfo[];

  // TODO: Get rooms from database instead of hard-coding them
  rooms: Room[] = [
    { roomName: 'Rum 1', roomId: 1 },
    { roomName: 'Rum 2', roomId: 2 }
  ];

  areas: Area[] = [
    { areaName: 'Område 1', areaId: 1 },
    { areaName: 'Område 2', areaId: 1 }
  ];


  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog) { }

  openDialog(): void {

    // TODO: Get information about the material from the back end here and then send it to the dialog
    this.given_storage_room_id = 1; //TODO: Get storage room ID here
    this.given_area_id = 1; //TODO: Get area id here

    this.packageInfo = [{ name: 'P1', packageMaterials: ['77', '65', '22'], reference_number: 911131 },
    { name: 'P2', packageMaterials: ['72', '64', '28', '11', '24'], reference_number: 911131 },
    { name: 'P3', packageMaterials: ['71', '61'], reference_number: 805120 },
    { name: 'K1', packageMaterials: ['70', '60', '50', '40'], reference_number: 404022 },
    { name: 'K2', packageMaterials: ['77'], reference_number: 501012 }
    ]

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
        area: this.areas.find(x => x.areaId === this.given_area_id).areaName, //finds the room name from the given id
        storage_room: this.rooms.find(x => x.roomId === this.given_storage_room_id).roomName, //finds the room name from the given id
        preChosen: this.preChosen,
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
  }
}

@Component({
  selector: 'app-package-check-in-dialog',
  templateUrl: './package-check-in-dialog.component.html',
})
export class PackageCheckInDialogComponent implements OnInit {
  checkOutConfirmed: boolean = false;
  packageNotFound : boolean = false;
  checkInPackageForm: FormGroup;

  shelves: string[] = [ //TODO: Get shelves from database here instead
    'A15', 'A18', 'B18', 'B23'
  ];
  packages: string[];

  filteredOptions: Observable<PackageInfo[]>;



  constructor(
    public dialogRef: MatDialogRef<PackageCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.filteredOptions = this.checkInPackageForm.get('package').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.data.packageInfo.slice())
    );
  }

  private _filter(name: string): PackageInfo[] {
    const filterValue = name.toLowerCase();

    return this.data.packageInfo.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  createForm() {
    // create variables and validators for form fields
    this.checkInPackageForm = this.fb.group({
      package: [''],
      reference_number: ['', Validators.required],
      area: [{ value: '', disabled: true }, Validators.required],
      storage_room: [{ value: '', disabled: true }, Validators.required],
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

  onConfirm(): void {
    this.checkOutConfirmed = true;
    
    // TODO: check out the package to the back end here.
    // fields: data.package, data.storage_room, data.area (branch), data.shelf, data.comment
  }
  // runs when package is changed
  updateFields(): void {
    if (this.data.package && this.data.package.length > 0) {
      if (this.data.packageInfo && this.data.packageInfo.find(x => x.name === this.data.package)) {
        this.data.reference_number = this.data.packageInfo.find(x => x.name === this.data.package).reference_number;
        this.data.packageMaterials = this.data.packageInfo.find(x => x.name === this.data.package).packageMaterials;
      } else {
        this.data.reference_number = null;
        this.data.packageMaterials = [];
      }
    }
  }
}
