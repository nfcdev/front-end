import { Component, OnInit, Inject, ElementRef, ExistingSansProvider } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import{CheckInDublcateComponent} from '../check-in-dublcate/check-in-dublcate.component';
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
export interface Shelf {
  shelfName: String;
  shelfId: number;
}
export interface Area {
  areaName: String;
  areaId: number;
}
export interface Package {
  packageName: String;
  packageId: number;
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
  providers:[CheckInDublcateComponent],
  selector: 'app-material-check-in-dialog',
  templateUrl: './material-check-in-dialog.component.html',
})
export class MaterialCheckInDialogComponent {
  checkOutConfirmed : boolean = false;
  checkInForm: FormGroup;
  storage_room_id: Number;
  branch_id: Number;
  dublcate: boolean;
  shelves: Shelf[];
  packages: Package[];


  constructor(
    public dialogRef: MatDialogRef<MaterialCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private duplicateComp: CheckInDublcateComponent,
    private dataService: DataService,
    private fb: FormBuilder,
    private storageRoomStore: StorageRoomStore) {
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

      //Get the packages that belong to the current room
      this.dataService.sendGetRequest("/package/storageroom/" + this.storage_room_id).subscribe((data: any[])=>{
        var tmp_packages = []
        for (var d of data) {
          var tmp: Package = {"packageName": d.package_number,
                            "packageId": d.id}
          tmp_packages.push(tmp);
        }
        this.packages = tmp_packages;
      })

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
    console.log(this.data.material_number.toString())
    this.addMaterial(this.data.material_number.toString());
    
    this.checkOutConfirmed = true;

  //TODO: If item(s) does not exist, add case number and do different back-end call


  //For check in of existing items
   for (var mat of this.data.selectedMaterials) {

    var post_data = {"material_number": mat,
                    "storage_room": this.storage_room_id,
                    "shelf": this.getShelfId(this.data.shelf)
                    };

      //If comment is added then add it to data for post-request
      if (this.data.comment !== "" && this.data.comment !== null) {
        post_data["comment"] = this.data.comment;
      }

      //If package is added then add it to data for post-request
      if (this.data.package !== "" && this.data.package !== undefined) {
        post_data["package"] = this.data.package;
      }

      this.dataService.sendPostRequest("/article/check-in", post_data).subscribe((data: any[])=>{
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

  // /article?material_number=input
  addMaterial (newMaterial : string) : void {
     console.log(this.dublcate)
    this.dataService.sendGetRequest("/article?material_number="+newMaterial).subscribe((data: DialogData)=>{
      console.log(data[0].status)
      console.log(data[0].status.includes("checked_in"));
      if (data[0].material_number.includes(newMaterial) && data[0].status.includes("checked_in")){
       
        this.dublcate = this.duplicateComp.openDialog();
          
        console.log(this.dublcate)
        
        if(!this.dublcate){
          console.log(this.dublcate)
          if (!this.data.selectedMaterials.includes(newMaterial)) { 
            if(newMaterial && newMaterial.length > 0) {
              this.data.selectedMaterials.push(newMaterial);
              this.checkInForm.controls['material_number'].reset()
              
            }
          }
          
        }
      }   
      
    })
   
    //this.addCase(newMaterial); TODO: FIX THIS WHEN YOU CAN EITHER GET ID OR REQUEST WITH MATERIAL_NO
    
  }

  getShelfId(chosenShelfName) : number {
    for (var shelf of this.shelves) {
      if (chosenShelfName === shelf.shelfName) {
        return shelf.shelfId;
      }
    }
  }

  getShelfName(chosenShelfId) : String {
    for (var shelf of this.shelves) {
      if (chosenShelfId === shelf.shelfId) {
        return shelf.shelfName;
      }
    }
  }

  getPackageId(chosenPackageName) : number {
    for (var pg of this.packages) {
      if (chosenPackageName=== pg.packageName) {
        return pg.packageId;
      }
    }
  }

  removeMaterial(material : string ) : void {
    this.data.selectedMaterials.forEach((item, index) => {
      if (item === material) this.data.selectedMaterials.splice(index, 1);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async updatePackages() {
    //Sleep needed because focusout-event triggers before data is submitted
    await this.sleep(150);
    var shelf_id = this.getShelfId(this.data.shelf);
    if (shelf_id !== undefined) {
      this.dataService.sendGetRequest("/package/shelf/" + shelf_id).subscribe((data: any[])=>{
        var tmp_packages = []
        for (var d of data) {
          var tmp: Package = {"packageName": d.package_number,
                            "packageId": d.id}
          tmp_packages.push(tmp);
        }
        this.packages = tmp_packages;
      })
   }
  }

  async updateShelf() {
    //Sleep needed because focusout-event triggers before data is submitted
    await this.sleep(150);
    var package_id = this.getPackageId(this.data.package);
    if (package_id !== undefined) {
      this.dataService.sendGetRequest("/package/" + package_id).subscribe((data: any)=>{
        var package_shelf = data.shelf
        var tmp_shelves = []
        var tmp: Shelf = {"shelfName": this.getShelfName(data.shelf),
                          "shelfId": data.shelf}
        this.shelves = [tmp];
      })
    }
  }

}

