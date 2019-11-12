import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

// Table fields
export interface EventTable {
  date: string;
  event: string;
  branch: string;
  room: string;
  shelf: string;
  package: string;
  user: string;
  comment: string;
}

export interface MaterialInfo {
  created_by: string;
  created_date: string;
  status: string;
  current_placement: string;
  last_modified: string;
}

// Temporary test data. TODO: Get this data from the back-end using the provided material_number
const EVENT_DATA: EventTable[] = [
  {date: '20190123 11.02', event: 'Skapad', branch: 'Vapen', room: 'Vapen Material', shelf: 'H15', package: 'P1', user: 'user1', comment: null},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: 'En kommentar'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: 'En till kommentar'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''}
];

const MATERIAL_DATA: MaterialInfo = {created_by: 'user1', created_date: '20190123',
  status: 'Incheckad', current_placement: 'Bio; Bio Uppack; A15; P1', last_modified: '20190211 11.03'};

export interface DialogData{
  material_number: number;
  EVENT_DATA: EventTable[];
  MATERIAL_DATA: MaterialInfo;
}



@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.less']
})
export class MaterialPageComponent implements OnInit {
  @Input()material_number:Number;
  table_data: EventTable[] = EVENT_DATA;
  material_data: MaterialInfo = MATERIAL_DATA;
  

  constructor(public dialog: MatDialog) {
    

   }

  openDialog(): void {

    // TODO: Get information about the material here and then send it to the dialog

    const dialogRef = this.dialog.open(MaterialPageDialogComponent, {
      width: '1000px',
      data:
      {material_number: this.material_number,
        EVENT_DATA: this.table_data,
        MATERIAL_DATA: this.material_data
      }
    });

  }

  ngOnInit() {
  }

}


@Component({
  selector: 'app-material-page-dialog',
  templateUrl: './material-page-dialog.component.html',
})
export class MaterialPageDialogComponent {
  displayedColumns = ['comment', 'date', 'event', 'branch', 'room', 'shelf', 'package', 'user'];
  dataSource = EVENT_DATA;

  constructor(
    public dialogRef: MatDialogRef<MaterialPageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

    // Runs when X-button is clicked
  onNoClick(): void {  
    this.dialogRef.close();
  }
    // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }
}


