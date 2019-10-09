import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.less']
})
export class CheckInFormComponent implements OnInit {


  name:string;


  constructor(public dialog: MatDialog) { }

  

  openDialog(): void {
    console.log("Hej");
    const dialogRef = this.dialog.open(CheckInFormDialog, {
      width: '250px',
      data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.name = result;
    });
  }

  ngOnInit() {
  }

  
}

@Component({
  selector: 'app-check-in-form-dialog',
  templateUrl: './check-in-form-dialog.component.html',
})
export class CheckInFormDialog {

  constructor(
    public dialogRef: MatDialogRef<CheckInFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

