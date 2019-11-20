import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {

}


@Component({
  selector: 'app-manage-system-dialog',
  templateUrl: './manage-system-dialog.component.html',
  styleUrls: ['./manage-system-dialog.component.less']
})
export class ManageSystemDialogComponent implements OnInit {


  constructor(public dialog: MatDialog) { }

  openDialog(): void {


    const dialogRef = this.dialog.open(ManageSystemDialogPopupComponent, {
      width: '1500px',
      height: '900px',
      data:
      {
      }
    });
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-manage-system-popup-dialog',
  templateUrl: './manage-system-dialog-popup.component.html',
})
export class ManageSystemDialogPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ManageSystemDialogPopupComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }
  

    // Runs when X-button is clicked
    onNoClick(): void {
      this.allDialogRef.closeAll();
    }
      // Runs when the back arrow button is clicked
    onBackButton() : void {
      this.dialogRef.close();
    }
}
