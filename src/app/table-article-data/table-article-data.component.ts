import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MaterialCheckBoxService } from './material-check-box.service';
import { DataService } from '../data.service';
import { StorageRoomStore } from '../storage-room/storage-room-store'

export var dataSource: TableArticleDataDataSource;

export function transformData(requestData) {
  var data = [];
  for (const d of requestData) {
    var tmp = {"material_number": d["material_number"],
              "reference_number": d["reference_number"],
              "branch": d["branch"],
              "storage_room": d["storage_room"],
              "shelf": d["shelf"],
              "package_number": d["package"],
              "status": d["status"],
              "timestamp": d["timestamp"],
              "last_modified": d["last_modified"]
              };

    data.push(tmp);
  }
  return data;
}

@Component({
  selector: 'app-table-article-data',
  templateUrl: './table-article-data.component.html',
  styleUrls: ['./table-article-data.component.less']
})
export class TableArticleDataComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<TableArticleDataItem>;
  //dataSource: TableArticleDataDataSource;
  storageRoom: StorageRoomStore;
  selection = new SelectionModel(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'case_nr', 'article_nr', 'package_nr', 'branch', 'storage_room', 'shelf','last_modified' ];

  constructor(
    private materialCheckOutService: MaterialCheckBoxService,
    private dataService: DataService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        dataSource.data.forEach(row => this.selection.select(row));
  }

 
  ngOnInit() {
    this.storageRoom = new StorageRoomStore();
    console.log("Storage room:" + this.storageRoom.getStorageRoom());
    //TODO: The call should be changed to this when it is possible to access a correct Storage room.
    //this.dataService.sendGetRequest("/article/storageroom/" + this.storageRoom.getStorageRoom()).subscribe((data: any[])=>{
    this.dataService.sendGetRequest("/article").subscribe((data: any[])=>{
      
      dataSource = new TableArticleDataDataSource(transformData(data));
      console.log(dataSource);
      dataSource.sort = this.sort;
      dataSource.paginator = this.paginator;
      console.log("table: " + this.table)
      this.table.dataSource = dataSource;
    })

    //this.dataSource = new TableArticleDataDataSource(data);
    this.selection.changed.subscribe(newSelection => {
      this.materialCheckOutService.update(this.selection);
    });
  }



 
}
