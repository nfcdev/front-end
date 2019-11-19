import { Component } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: './check-in-dublcate',
  templateUrl: './check-in-dublcate.component.html',
  styleUrls: ['./check-in-dublcate.component.less']
})
export class CheckInDublcateComponent {
constructor(public dialog: MatDialog) {}
openDialog() {
  const dialogRef = this.dialog.open(CheckInDublcateComponentDialog);
  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
} 
}
@Component({
  selector: 'check-in-dublcate-component',
  templateUrl: './check-in-dublcate-component-dialog.html',
})
export class CheckInDublcateComponentDialog {
  constructor(
  public dialog: MatDialogRef<CheckInDublcateComponentDialog>){}

  onNoClick(): void {
    this.dialog.close();
  }
}