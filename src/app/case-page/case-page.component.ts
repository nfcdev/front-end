import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface CaseInfo {
  created_date: string;
  status: string;
  time_active: string;
  last_modified: string;
}


export interface DialogData{
  reference_number: number;
  case_info: CaseInfo;
  materials: MaterialInfo[];
}

export interface MaterialInfo {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package: string;
}


@Component({
  selector: 'app-case-page',
  templateUrl: './case-page.component.html',
  styleUrls: ['./case-page.component.less']
})



export class CasePageComponent implements OnInit {

  @Input()reference_number: number;
  case_info: CaseInfo;
  materials: MaterialInfo[];

  constructor(public dialog: MatDialog) { }


  openDialog(): void {

    // TODO: Get information about the case from the back end here and then send it to the dialog
    this.case_info = {created_date: '20190123 11.02', status: 'Aktiv',
     time_active: '21d 2h 3min', last_modified: '21d 2h 3min'};
    this.materials = [{material_number: '12', reference_number: '12', branch:'Bio', 
    storage_room: 'Bio Uppack', shelf: 'B15', package: 'P2'},
    {material_number: '12', reference_number: '12', branch:'Vapen', 
    storage_room: 'Vapen Uppack', shelf: 'A15', package: null}];

    const dialogRef = this.dialog.open(CasePageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {reference_number: this.reference_number,
        case_info: this.case_info

      }
    });

  }

  ngOnInit() {
    // this.caseInfo.branches
  }

}
const STATUSES: string[] = ['Aktiv', 'Inaktiv'];

@Component({
  selector: 'app-case-page-dialog',
  templateUrl: './case-page-dialog.component.html',
})
export class CasePageDialogComponent {

  statuses: string[] = STATUSES;


  constructor(
    public dialogRef: MatDialogRef<CasePageDialogComponent>,
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
