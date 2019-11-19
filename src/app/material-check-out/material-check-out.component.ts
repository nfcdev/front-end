import { Component, OnInit, Inject } from '@angular/core';
import { MaterialCheckOutService } from './material-check-out.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel, DataSource } from '@angular/cdk/collections';

export interface DialogData{
  selection: any[];
}

@Component({
  selector: 'app-material-check-out',
  templateUrl: './material-check-out.component.html',
  styleUrls: ['./material-check-out.component.less']
})
export class MaterialCheckOutComponent implements OnInit {

  selection : any[];

  constructor(
    private materialCheckOutService: MaterialCheckOutService,
    public dialog: MatDialog
  ) { }

  openDialog(): void {
    // TODO: Get information about the material from the back end here and then send it to the dialog
    console.log(this.selection);
    const dialogRef = this.dialog.open(MaterialCheckOutDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {selection: this.selection
      }
    });

  }

  ngOnInit() {
    this.materialCheckOutService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
    });
  }

}

@Component({
  selector: 'app-material-check-out-dialog',
  templateUrl: './material-check-out-dialog.component.html',
})
export class MaterialCheckOutDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MaterialCheckOutDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
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
