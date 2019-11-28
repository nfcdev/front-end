import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';


export interface DialogData{
  package: string;
  materials: string[];
}

// Temporary test data
const MATERIALS: string[] = ['2019020355-14', '2019020355-15', '33123123', '42123123', '772312333', '33123123', '21123'];


@Component({
  selector: 'app-package-page',
  templateUrl: './package-page.component.html',
  styleUrls: ['./package-page.component.less']
})
export class PackagePageComponent implements OnInit {
  @Input()package: string;
  materials: string[];
  constructor(public dialog: MatDialog) { }


  openDialog(): void {
    // TODO: Get information about the materials that are in this package from the back end here and then send it to the dialog
    this.materials = MATERIALS;

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
