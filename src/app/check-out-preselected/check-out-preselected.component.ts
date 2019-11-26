import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


export interface DialogData{
  selectedPackages: string[];
  preSelected: boolean;
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
    
   
    const dialogRef = this.dialog.open(CheckOutPreselectedDialogComponent,{
      width:'800px',
      height:'400px',
      data:
      {selectedPackages: this.packages,
        preChosen: this.preChosen
      }
      
    })

  }
  ngOnInit() {
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.packages = this.selection.reduce((a, {material_number}) => a.concat(material_number), []);
    });
    if((this.packages && this.packages.length > 0)){
      this.preChosen= true;
     
    } 
  }
  
}
@Component({
  selector: 'app-check-out-preselected-dialog',
  templateUrl: 'check-out-preselected-dialog.html',
})
export class CheckOutPreselectedDialogComponent implements OnInit {
  checkOutConfirmed : boolean = false;
  preChosen : boolean = false;
  comment :String;
  constructor(
    public dialogRef: MatDialogRef<CheckOutPreselectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData){}
  
    
  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() : void {
    this.checkOutConfirmed = true;
    console.log(this.comment);
    // TODO: check-out the materials in this.data.selection in the back-end here together with this.comment
  }

  ngOnInit() : void {
    
  }
}