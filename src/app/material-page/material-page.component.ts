import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';



// Event table fields
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

// Material info fields
export interface MaterialInfo {
  created_by: string;
  created_date: string;
  status: string;
  current_placement: string;
  last_modified: string;
  description: string;
}


// Temporary test data. TODO: Get this data from the back-end using the provided material_number
const EVENT_DATA: EventTable[] = [
  {date: '20190123 11.02', event: 'Skapad', branch: 'Vapen', room: 'Vapen Material', shelf: 'H15', package: 'P1', user: 'user1', comment: null},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: 'En kommentar'},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: 'En till kommentar'},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''},
  {date: '20190211 11.03', event: 'Incheckat', branch: 'Bio', room: 'Bio Uppack', shelf: 'A15', package: 'P1', user: 'user2', comment: ''}
];

// Temporary test data.
const MATERIAL_DATA: MaterialInfo = {created_by: 'user1', created_date: '20190123',
  status: 'Incheckat', current_placement: 'Bio; Bio Uppack; A15; P1', last_modified: '20190211 11.03', description: 'Ruta för beskrivning. Inte kopplat till back-end ännu.'};

export interface DialogData{
  material_number: number;
  event_data: EventTable[];
  material_data: MaterialInfo;
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

    // TODO: Get information about the material from the back end here and then send it to the dialog

    const dialogRef = this.dialog.open(MaterialPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {material_number: this.material_number,
        event_data: this.table_data,
        material_data: this.material_data
      }
    });

  }

  ngOnInit() {
  }

}
// The different statuses a material can have
const STATUSES: string[] = ['Incheckat','Utcheckat','Åter','Införlivat','Kasserat'];

@Component({
  selector: 'app-material-page-dialog',
  templateUrl: './material-page-dialog.component.html',
})
export class MaterialPageDialogComponent {
  displayedColumns = ['comment', 'date', 'event', 'branch', 'room', 'shelf', 'package', 'user'];
  dataSource = this.data.event_data;
  statuses: string[] = STATUSES;


  constructor(
    public dialogRef: MatDialogRef<MaterialPageDialogComponent>,
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
  // This function is run when a new status is selected in the status selection 
  changeStatus() : void{
    // TODO: change the status in the back-end
    // console.log(this.data.material_data.status);
  }
}


