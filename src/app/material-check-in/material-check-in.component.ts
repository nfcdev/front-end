import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { StorageRoomStore } from "../storage-room/storage-room-store";
import { StorageRoomService } from "../storage-room/storage-room.service";
import { DataService } from "../data.service"
import { variable } from '@angular/compiler/src/output/output_ast';

export interface DialogData {
  material_number: any;
  reference_number: number;
  branch: String;
  storage_room: String;
  shelf: String;
  package: String;
  comment: String;
  placement: any;
}

export interface Room {
  roomName: String;
  roomId: number;
}
export interface Area {
  areaName: String;
  areaId: number;
}

export interface DialogData{
  selectedMaterials: String[];
  preChosen: boolean;
}


@Component({
  selector: 'app-material-check-in',
  templateUrl: './material-check-in.component.html',
  styleUrls: ['./material-check-in.component.less']
})
export class MaterialCheckInComponent implements OnInit {


  selection : any[];
  materials: String[];
  preChosen = false;

  storage_room: String;
  branch: String;


  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog,
    private storageRoomStore: StorageRoomStore,
    private storageRoomService: StorageRoomService,
    ) { }

  openDialog(): void {

    if((this.materials && this.materials.length > 0)){
      this.preChosen= true;
    } else {
      this.preChosen = false;
      this.materials = [] as String[];
    }

    const dialogRef = this.dialog.open(MaterialCheckInDialogComponent, {
      width: '500px',

      data:
      {branch: this.branch,
      storage_room: this.storage_room,
      selectedMaterials: this.materials,
      preChosen: this.preChosen
      }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this
      console.log(result);

      // TODO: Jsonify data and send to back-end

       // reset material list
      this.materials = [];
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
      this.materials = this.selection.reduce((a, {material_number}) => a.concat(material_number), []);
    });
  }
}

@Component({
  selector: 'app-material-check-in-dialog',
  templateUrl: './material-check-in-dialog.component.html',
})
export class MaterialCheckInDialogComponent {
  checkOutConfirmed : boolean = false;

  checkInForm: FormGroup;

  shelves: string[] = [ //TODO: Get shelves from database here instead
    'A15', 'A18', 'B18', 'B23'
  ];


  constructor(
    public dialogRef: MatDialogRef<MaterialCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private fb: FormBuilder) {
      this.createForm();
    }
  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      material_number: [''],
      //reference_number: ['', Validators.required], //Should always be pre-filled?
      branch: [{value: '', disabled: true}, Validators.required],
      storage_room: [{value: '', disabled: true}, Validators.required],
      shelf: ['', Validators.required],
      package: [''],
      comment: ['']
    });

  }

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }

  // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }

  onConfirm() : void {
    this.checkOutConfirmed = true;

  //TODO: If item(s) does not exist, add case number and do different back-end call


  //For check in of existing items
   for (var mat of this.data.selectedMaterials) {
    var post_data = {"material_number": mat,
                    "storage_room": this.data.storage_room,
                    "shelf": this.data.shelf
                    };
                    console.log(typeof(post_data))
    //TODO: Add optional items to post_data
   
    console.log(this.data.comment);
    console.log(this.data.comment !== "");
    console.log(this.data.package !== null);

    if (this.data.comment !== "" && this.data.package !== null) {
      console.log("TEST")
      post_data["comment"] = this.data.comment;
    }

    if (this.data.package !== "" && this.data.package !== undefined) {
      post_data["package"] = this.data.package;
    }

    console.log(post_data);
    this.dataService.sendPostRequest("/article/check-in", post_data).subscribe((data: any[])=>{
      console.log(data);
    })

    }


   }


  addCase(currentMaterial : string) : boolean {
    this.dataService.sendGetRequest("/article/" + currentMaterial).subscribe((data: any[])=>{
      console.log(data);
    })
    //Get case for the chosen material
    //If case is empty, then add case.
    //If the case is same as previous case, then return true.
    return true;
  }

  addMaterial(newMaterial : string) : void {
    //this.addCase(newMaterial); TODO: FIX THIS WHEN YOU CAN EITHER GET ID OR REQUEST WITH MATERIAL_NO
    if (!this.data.selectedMaterials.includes(newMaterial)) { 
      if(newMaterial && newMaterial.length > 0) {
        this.data.selectedMaterials.push(newMaterial);
        this.checkInForm.controls['material_number'].reset()

      }
    } else {
      // duplicate
    }
  }

  removeMaterial(material : string ) : void {
    this.data.selectedMaterials.forEach((item, index) => {
      if (item === material) this.data.selectedMaterials.splice(index, 1);
    });
  }
}

