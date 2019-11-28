import { Component, OnInit, Inject } from '@angular/core';
// import { PackageCheckBoxService } from '../table-article-data/package-check-box.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData{
  selectedPackage: string;
  preChosen: boolean;
  package: any;
}

@Component({
  selector: 'app-package-check-out',
  templateUrl: './package-check-out.component.html',
  styleUrls: ['./package-check-out.component.less']
})
export class PackageCheckOutComponent implements OnInit {

  selection : any[];
  package: string;
  preChosen = false;

  constructor(
   // private packageCheckBoxService: PackageCheckBoxService,
    public dialog: MatDialog
  ) { }

  openDialog(): void {
    // TODO: Get information about the package from the back end here and then send it to the dialog

    if((this.package && this.package.length > 0)){
      this.preChosen= true;
    } else {
      this.preChosen = false;
      this.package = '';
    }
    const dialogRef = this.dialog.open(PackageCheckOutDialogComponent, {
      width: '400px',
      height: '500px',
      data:
      {selectedPackage: this.package,
        preChosen: this.preChosen
      }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this
      //console.log(result);

      

      // resets the package list
      this.package = '';

      } else {
        console.log('Empty result');
      }
      
    });

  }

  

  ngOnInit() {

  }

}

@Component({
  selector: 'app-package-check-out-dialog',
  templateUrl: './package-check-out-dialog.component.html',
})
export class PackageCheckOutDialogComponent implements OnInit{
  checkOutConfirmed : boolean = false;
  preChosen : boolean = false;
  comment: string;
  package: string;

  packageCheckOutForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<PackageCheckOutDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }

    createForm() {
      // create variables and validators for form fields
      this.packageCheckOutForm = this.fb.group({
        package: ['', Validators.required],
        comment: ['']
      });
    }

    // Runs when  X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }
// Runs when "Checka Ut" button is pressed
  onConfirm() : void {
    this.checkOutConfirmed = true;
    console.log(this.comment);
    // TODO: check out this.data.package to the back-end here
  }

  ngOnInit() : void {
    
  }
}
