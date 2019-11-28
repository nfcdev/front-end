import { Component, OnInit, Input, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';


export interface DialogData{
  shelf: string;
  shelfPageData: ShelfPageData[];
}

export interface ShelfPageData {
  packageMaterials: string[];
  package: string;
}

// Temporary test data
const SHELF_DATA: ShelfPageData[] =  [{ package: 'P1', packageMaterials: ['77', '65', '22']},
{ package: 'P2', packageMaterials: ['72', '64', '28', '11', '24']},
{ package: 'P3', packageMaterials: ['71', '61']},
{ package: 'K1', packageMaterials: ['70', '60', '50', '40']},
{ package: 'K2', packageMaterials: ['77']},
{ package: 'K3', packageMaterials: ['72','73','74','75','76','78','79','80','81','82','83','84','85','86','87','88','89',]},
{ package: 'K4', packageMaterials: []}
]

@Component({ 
  selector: 'app-shelf-page',
  templateUrl: './shelf-page.component.html',
  styleUrls: ['./shelf-page.component.less']
})
export class ShelfPageComponent implements OnInit {
  @Input()shelf: string;
  shelfPageData: ShelfPageData[];
  constructor(public dialog: MatDialog) { }


  openDialog(): void {

    // TODO: Get packages and their contained materials here from the back end and send it to the dialog
    this.shelfPageData = SHELF_DATA;

    const dialogRef = this.dialog.open(ShelfPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {shelf: this.shelf,
        shelfPageData: this.shelfPageData
      }
    });

  }
  ngOnInit() {
    
  }

}

@Component({
  selector: 'app-shelf-page-dialog',
  templateUrl: './shelf-page-dialog.component.html',
})
export class ShelfPageDialogComponent implements AfterViewInit{


  constructor(
    public dialogRef: MatDialogRef<ShelfPageDialogComponent>,
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
  ngAfterViewInit() {
  }
}

