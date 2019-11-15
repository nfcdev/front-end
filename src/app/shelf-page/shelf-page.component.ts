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
  material_number: number;
  package: string;
}

// Temporary test data
const SHELF_DATA: ShelfPageData[] = [{material_number: 33, package: null},
  {material_number: 2233, package: 'P1'},
  {material_number: 7333, package: 'K1'},
  {material_number: 992233, package: 'K3'},
  {material_number: 872233, package: null},
  {material_number: 22332, package: 'P1'},
  {material_number: 733322, package: 'K1'},
  {material_number: 9922333, package: 'K3'},
  {material_number: 87223113, package: null},
  {material_number: 222333, package: 'P4'},
  {material_number: 73332, package: 'K7'},
  {material_number: 99233, package: 'K3'},
  {material_number: 87233, package: null},
  {material_number: 222323, package: 'P2'}];

@Component({
  selector: 'app-shelf-page',
  templateUrl: './shelf-page.component.html',
  styleUrls: ['./shelf-page.component.less']
})
export class ShelfPageComponent implements OnInit {
  @Input()shelf: string;
  shelfPageData: ShelfPageData[] = SHELF_DATA;
  constructor(public dialog: MatDialog) { }


  openDialog(): void {

    // TODO: Get materials and their packages here from the back end and send it to the dialog

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
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns = ['material_number', 'package'];
  dataSource = new MatTableDataSource(this.data.shelfPageData);

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
    this.dataSource.sort = this.sort;
  }
}

