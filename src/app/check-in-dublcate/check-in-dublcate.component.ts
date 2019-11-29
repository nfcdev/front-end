import { Component, Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData{
  buttonClick:boolean;

}

@Component({
  selector: './check-in-dublcate',
  templateUrl: './check-in-dublcate.component.html',
  styleUrls: ['./check-in-dublcate.component.less']
})
export class CheckInDublcateComponent {
  dialogRef: any;
  buttonClick:boolean =true;
constructor(public dialog: MatDialog) {}
openDialog(): boolean{
  let dialogRef = this.dialog.open(CheckInDublcateComponentDialog, {
    data: {buttonClick: this.buttonClick}
  });
  dialogRef.afterClosed().subscribe(result => {
    dialogRef.close(this.buttonClick);
    console.log(this.buttonClick)
    return(result);
    
  })
 
  

  return this.buttonClick;
  
} 
}
@Component({
  selector: 'check-in-dublcate-component',
  templateUrl: './check-in-dublcate-component-dialog.html',
})
export class CheckInDublcateComponentDialog {
  buttonClick:boolean;
  constructor(
  public dialog: MatDialogRef<CheckInDublcateComponentDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData){}

  onNoClick(): any{
    this.buttonClick = false;
    this.dialog.close(this.buttonClick);
  }
  onConfirm():any{
    this.buttonClick = true;
    this.dialog.close(this.buttonClick);
  }
  
}