import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageRoomService } from "../storage-room/storage-room.service";
import { DataService } from '../data.service';
import {
  StorageRoomStore,
  StorageRoom
} from "../storage-room/storage-room-store";

export interface DialogData{
  selectedPackages: string[];
  preSelected: boolean;
  comment: string;
}
@Component({
  selector: 'app-check-out-preselected',
  templateUrl: './check-out-preselected.component.html',
  styleUrls: ['./check-out-preselected.component.less']
})
export class CheckOutPreselectedComponent implements OnInit{

  selection : any[];
  packages: string[];
  preChosen = false;
  constructor(private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog) {}

    
      

  openDialog(): void {
    
    this.dialog.open(CheckOutPreselectedDialogComponent,{
      width:'800px',
      height:'400px',
      data:
      {selectedPackages: this.packages,
        preChosen: this.preChosen,
      }
      
    })
    console.log(this.packages[0]);
  }
  ngOnInit() {
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.packages = this.selection.reduce((a, {package_number}) => a.concat(package_number), []);
      
    });
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => { if((this.packages && this.packages.length > 0)){
      this.preChosen= true;
    }else{
     this.preChosen=false;
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
  checkOutConfirmed : boolean = false;
  preChosen : boolean = false;
  comment :String;
 storage_room_id: number;
  dataService: DataService;
  constructor(
    public dialogRef: MatDialogRef<CheckOutPreselectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private storageRoomService: StorageRoomService){}

 
    
  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  onConfirm() : void {
    this.checkOutConfirmed = true;
    console.log(this.comment);
//For check in of existing items
for (var package_nr of this.data.selectedPackages) {
  var post_data = {"package_number": package_nr,
                  "comment":this.comment,
                  "storage_room": this.storage_room_id
                  };
    //If comment is added then add it to data for post-request
    if (this.comment !== "" && this.data.selectedPackages !== null) {
      post_data["comment"] = this.comment;
    }
    //If package is added then add it to data for post-request
    if (this.data.selectedPackages !== undefined) {
      post_data["package"] = this.data.selectedPackages;
      //post_data["storage_room"] = this.
    }
    console.log(post_data)
    this.dataService.sendPostRequest("/package/check-out", post_data).subscribe((data: any[])=>{
    })
 
}

    // TODO: check-out the materials in this.data.selection in the back-end here together with this.comment
  }

  ngOnInit() : void {
    
  }

  
  
}