import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CheckInFormDialogComponent } from '../check-in-form-dialog/check-in-form-dialog.component';
@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.less']
})
export class CheckInFormComponent implements OnInit {

  material_number:Number;
  reference_number:Number;
  description:String;
  name:String;
  storage_room_id:Number;
  placement:String;
  parent_article_id:Number;

  constructor(public dialog : MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(CheckInFormDialogComponent, {
      width: '250px',
      data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.name = result;
    });
  }

  ngOnInit() {
  }


}
