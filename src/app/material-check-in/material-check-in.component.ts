import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { StorageRoomStore } from "../storage-room/storage-room-store";
import { StorageRoomService } from "../storage-room/storage-room.service";
import { DataService } from "../data.service"


export interface DialogData {
  material_number: any;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package: string;
  comment: string;
  placement: any;
  selectedMaterials: String[];
  preChosen: boolean;
}

export interface Room {
  roomName: String;
  roomId: number;
}
export interface Shelf {
  shelfName: String;
  shelfId: number;
}

export interface DataShelf {
  current_storage_room: number;
  id: number;
  shelf_name: string;
}

export interface DataPackage {
  id: number;
  package_number: string;
  shelf: number;
  case: number;
  current_storage_room: number;
  unpacked: boolean;
}

export interface Area {
  areaName: String;
  areaId: number;
}
export interface Package {
  packageName: String;
  packageId: number;
}
export interface package_shelf{
  shelf: string;

}
export interface packageData{
    id: number,
    package_number: string,
    shelf: number,
    case: number,
    current_storage_room: number
}

export interface Case {
  id: number;
  reference_number: string;
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

  materialsAreSameCase: boolean = true;


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

    // Check if the input materials belong to the same case
    for (let i=0; i < this.materials.length -1; i++) {
      if (this.materials[i].substring(0,6) !== this.materials[i+1].substring(0,6)) {
        this.materialsAreSameCase = false;
      }
    }
    var dialogRef;

    if (this.materialsAreSameCase) { // Opens the normal dialog for checking in material(s)
      dialogRef = this.dialog.open(MaterialCheckInDialogComponent, {
        width: '500px',
        height:'550px',
          
        data:
        {branch: this.branch,
        storage_room: this.storage_room,
        selectedMaterials: this.materials,
        preChosen: this.preChosen
        }
      });
    } else { // Opens a warningmessage when trying to check in materials from different cases
      dialogRef = this.dialog.open(FaultyMaterialMessageComponent);
      this.materialsAreSameCase = true;
    }  
    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {
      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this

        // reset material list
      this.materials = [];
      } else {
        console.log('Empty result');
        this.materialsAreSameCase = true;
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
export interface Duplicate {
  material_number: String;
  storage_room: String;
}

@Component({
  selector: 'app-material-check-in-dialog',
  templateUrl: './material-check-in-dialog.component.html',
})
export class MaterialCheckInDialogComponent {
  checkOutConfirmed : boolean = false;

  checkInForm: FormGroup;
  storage_room_id: Number;
  branch_id: Number;
  reference_number: string;
  shelves: Shelf[];
  packages: Package[] = [];
  dataPackages: DataPackage [];
  materialExists: boolean;
  newData: boolean =true;
  newCase: boolean = false;
  package_id: Number;

  duplicateMaterials: Duplicate[] = [];

  hasDuplicate: boolean = false;  


  constructor(
    public dialogRef: MatDialogRef<MaterialCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private fb: FormBuilder,
    private storageRoomStore: StorageRoomStore) {
      this.storageRoomStore.currentStorageRoom.subscribe(currentRoom => {
          this.branch_id = currentRoom.branch;
          this.storage_room_id = currentRoom.id;
      });

      // Earlier control when opening the dialog makes sure that the materials all belong to
      // the same case. The first 6 digits of the materialnumber is also the reference_number
      // which is why we can set the reference_number as the substring of the first material 
      // selected. 
      if (this.data.selectedMaterials[0]) {
        this.reference_number = this.data.selectedMaterials[0].substring(0,6);
      }


      //Get the shelves that belong to the current storage room
      this.dataService.sendGetRequest("/shelf/storageroom/" + this.storage_room_id).subscribe((data: DataShelf[])=>{
        var tmp_shelves: Shelf[] = []
        for (var d of data) {
          var tmp: Shelf = {"shelfName": d.shelf_name,
                            "shelfId": d.id}
          tmp_shelves.push(tmp);
        }
        this.shelves = tmp_shelves;
      })

      console.log("Detta är datan:" );
      console.log(this.data);

      //Get the packages that belong to the current room
      this.dataService.sendGetRequest("/package/storageroom/" + this.storage_room_id).subscribe((data: DataPackage[])=>{
        // Sets dataPackages to all the packages available in current room
        this.dataPackages = data;
        console.log("Hämtat alla paket");
        if (this.reference_number) {
          for (var p of data) {
            this.dataService.sendGetRequest("/case/" + p.case).subscribe((getCase: Case) => {
              console.log("Kollat ett paket");
              console.log(getCase);
              console.log(this.reference_number);
              if (getCase.reference_number === this.reference_number) {
                console.log("Pushar paket");
                this.packages.push({packageName: p.package_number, packageId: p.id});
              }
            })
          }
        }
      })
      

      this.createForm();
    }

  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      material_number: [''],
     reference_number: [''], //Should always be pre-filled?
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

  onXClick(): void{ // Runs when X is clicked
    this.dialogRef.close();
  }
  // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }
  onCheckOut() : void {
    let hasDuplicate = false;
    if (this.newData){
    this.data.selectedMaterials.forEach( (val, key, arr )=> {
      this.dataService.sendGetRequest('/article?material_number=' + val).subscribe( (data: any []) => {
        if(data[0].status === 'checked_in'){
          let temp: Duplicate = {material_number: val, storage_room: data[0].storage_room};
          this.duplicateMaterials.push(temp);
          hasDuplicate = true;

          

        }

        if(hasDuplicate){
          this.hasDuplicate = hasDuplicate;
        } else if (!hasDuplicate && Object.is(arr.length - 1, key)) { // no duplicate
          this.onConfirm();
        }
      
      });
    });
    }else{
      this.onConfirm();
    }
    
  }
  onCancelDuplicate () : void {
    this.duplicateMaterials = [];
    this.hasDuplicate = false;
    
  }


  onConfirm() : void {
    this.checkOutConfirmed = true;

  //TODO: If item(s) does not exist, add case number and do different back-end call


  //For check in of existing items
   for (var mat of this.data.selectedMaterials) {
    
    var article_data ={"material_number": mat,  
                      "description":"",
                      "comment": "",
   }

    var post_data = {"material_number": mat,
                    "storage_room": this.storage_room_id
                    };

      //If comment is added then add it to data for post-request
      if (this.data.comment !== "" && this.data.comment !== undefined) {
        post_data["comment"] = this.data.comment;
        article_data["comment"] =this.data.comment;
        article_data["description"] =this.data.comment;
      }else{
        post_data["comment"] = "";
        article_data["comment"] ="";
        article_data["description"] ="";
      }

      //If package is added then add it to data for post-request
      if (this.data.package !== "" && this.data.package !== undefined) {
        
        article_data["storage_room"]= this.storage_room_id
        
       this.dataService.sendGetRequest("/package/package_number/"+ this.data.package).subscribe((data: packageData)=>{
        this.package_id = data["id"];
        article_data["package"]=this.package_id;
        post_data["package"] = this.package_id; 
         
        if (!this.newData){
          
          this.dataService.sendPostRequest("/article/register", article_data).subscribe((data: any[])=>{
          })
        }else {
          console.log(post_data)
          this.dataService.sendPostRequest("/article/check-in", post_data).subscribe((data: any[])=>{
          })
        }
       })
      } else {
        post_data["shelf"] = this.getShelfId(this.data.shelf)
        article_data["shelf"] = this.getShelfId(this.data.shelf)
        article_data["storage_room"]= this.storage_room_id
        if (!this.newData){
          console.log(typeof article_data["package"])
            console.log(article_data); 
          this.dataService.sendPostRequest("/article/register", article_data).subscribe((data: any[])=>{
          })
        }else {
          console.log(post_data)
          this.dataService.sendPostRequest("/article/check-in", post_data).subscribe((data: any[])=>{
          })
        }
      }
      
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

  validMaterial(material: string): boolean {
    if (Number(material.substring(0,6)) && material.substring(6,7) === '-' && Number(material.substring(7))) { // Checks format
      if (this.data.selectedMaterials[0]) { // If we already have materials selected
        if (this.data.selectedMaterials[0].substring(0,6) === material.substring(0,6)) { // Checks that it is the right case
          return true;
        } else {
          return false;
        }
      } else { // If there are no materials selected, ergo a new material
        return true;
      }
    } else {
      return false;
    }
  }

  addMaterial(newMaterial : string) : void {
    if (this.validMaterial(newMaterial)) {
      this.dataService.sendGetRequest("/article?material_number="+newMaterial).subscribe( (data: DialogData)=>{
        if (data[0] != undefined ){
        this.newData = true;
      } else{
        this.newData = false;
      }
      
      this.reference_number=newMaterial.substring(0,6);
      this.dataService.sendGetRequest("/case?reference_number="+this.reference_number).subscribe( (data: any[])=>{
        for (var d of data){
          if (this.reference_number.includes(d.reference_number)){
            this.newCase=false;
            break;
          } else{
            this.newCase = true;
          }
        }
      })
      if (!this.data.selectedMaterials.includes(newMaterial)) { 
        if(newMaterial && newMaterial.length > 0) {
          this.data.selectedMaterials.push(newMaterial);
          this.checkInForm.controls['material_number'].reset()
        }
      } else {
        // duplicate
      }
      })
    }

    
  console.log(this.data.selectedMaterials)
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
    this.reference_number = "";
    this.newCase = false;
    this.newData = true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // packageSelected(selectedPackage: Package) {
  //   console.log(selectedPackage);
  //   var tempId = this.dataPackages.find(it=>it.id === selectedPackage.packageId).shelf;
  //   var tempName = this.shelves.find(it=>it.shelfId===tempId).shelfName;
  //   this.shelves = [{shelfId: tempId , shelfName: tempName }];
  //   console.log("Uppdaterat hyllor!")
  //   // this.dataService.sendGetRequest("/package/package_number/" + selectedPackage.packageName).subscribe((getPackage: DataPackage) => {
  //   //   this.shelves = []; 
  //   //   var tmp: Shelf = this.shelves.find(it => it.shelfId === getPackage.shelf);
  //   //   this.shelves = [tmp];
  //   //   console.log("Updated the paket döh");
  //   // })
  // }

  shelfSelected(selectedShelf: Shelf) {
    var tempPackages: Package [] = [];
    for (var p of this.dataPackages) {
      if (p.shelf === selectedShelf.shelfId) {
        tempPackages.push({packageId: p.id, packageName: p.package_number});
      }
    }
    this.packages = tempPackages;
  }

  // async updatePackages() {
  //   //Sleep needed because focusout-event triggers before data is submitted
  //   await this.sleep(150);
  //   var shelf_id = this.getShelfId(this.data.shelf);
  //   if (shelf_id !== undefined) {
  //     this.dataService.sendGetRequest("/package/shelf/" + shelf_id).subscribe((data: any[])=>{
  //       var tmp_packages = []
  //       for (var d of data) {
  //         var tmp: Package = {"packageName": d.package_number,
  //                           "packageId": d.id}
  //         tmp_packages.push(tmp);
  //       }
  //       this.packages = tmp_packages;
  //     })
  //  }
  // }

  // async updateShelf() {
  //   //Sleep needed because focusout-event triggers before data is submitted
  //   // await this.sleep(150);
  //   var package_id = this.getPackageId(this.data.package);
  //   if (package_id !== undefined) {
  //     this.dataService.sendGetRequest("/package/" + package_id).subscribe((data: DataPackage)=>{
  //       console.log(data);
  //       var tmp: Shelf = {"shelfName": this.getShelfName(data.shelf),
  //                         "shelfId": data.shelf}
  //       console.log(tmp);
  //       this.shelves.push(tmp);
  //     })
  //   }
  // }

}

@Component({
  selector: 'app-material-check-in-faultymessage',
  templateUrl: './material-check-in-faultymessage.component.html',
})
export class FaultyMaterialMessageComponent {
  constructor() {}
}

