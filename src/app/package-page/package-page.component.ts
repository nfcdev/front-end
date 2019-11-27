import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';


export interface DialogData{
  package: string;
  materials: number[];
}

// Temporary test data
const MATERIALS: number[] = [55123123, 42123123123, 33123123, 42123123, 7723123333, 33123123, 21123];


@Component({
  selector: 'app-package-page',
  templateUrl: './package-page.component.html',
  styleUrls: ['./package-page.component.less']
})
export class PackagePageComponent implements OnInit {
  @Input()package: string;
  materials: number[] = MATERIALS;
  constructor(public dialog: MatDialog) { }


  openDialog(): void {
    // TODO: Get information about the materials that are in this package from the back end here and then send it to the dialog

    const dialogRef = this.dialog.open(PackagePageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {package: this.package,
       materials: this.materials
      }
    });

  }
  ngOnInit() {
  }

}

@Component({
  selector: 'app-package-page-dialog',
  templateUrl: './package-page-dialog.component.html',
})
export class PackagePageDialogComponent {
  displayedColumns = ['material'];
  dataSource = this.data.materials;

  constructor(
    public dialogRef: MatDialogRef<PackagePageDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

    // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  onBackButton(): void {
    this.dialogRef.close();
  }
}
