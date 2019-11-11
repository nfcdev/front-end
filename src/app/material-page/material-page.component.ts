import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

export interface DialogData{
  material_number: number;
}



@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.less']
})
export class MaterialPageComponent implements OnInit {
  @Input()material_number:Number;
  

  constructor(public dialog: MatDialog) {
    

   }

  openDialog(): void {


    const dialogRef = this.dialog.open(MaterialPageDialogComponent, {
      width: '1000px',
      data:
      {material_number: this.material_number
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
  displayedColumns = ['date', 'event', 'branch', 'room', 'shelf', 'package', 'user'];
  dataSource = EVENT_DATA;

  constructor(
    public dialogRef: MatDialogRef<MaterialPageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

  onNoClick(): void {  
    this.dialogRef.close();
  }
}

export interface EventTable {
  date: string;
  event: string;
  branch: string;
  room: string;
  shelf: string;
  package: string;
  user: string;
}

const EVENT_DATA: EventTable[] = [
  {date: '20190123 11.02', event: 'Skapad', branch: 'Vapen', room: 'Vapen Material', shelf: 'H15', package: 'P1', user: 'user1'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'},
  {date: '20190211 11.03', event: 'Incheckad', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2'}
];
