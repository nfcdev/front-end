import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MaterialCheckBoxService } from './material-check-box.service';
import { DataService } from '../data.service';
import { StorageRoomStore } from '../storage-room/storage-room-store'



@Component({
  selector: 'app-table-article-data',
  templateUrl: './table-article-data.component.html',
  styleUrls: ['./table-article-data.component.less']
})
export class TableArticleDataComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<TableArticleDataItem>;
  dataSource: TableArticleDataDataSource;
  storageRoom: StorageRoomStore;
  selection = new SelectionModel(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'case_nr', 'article_nr', 'package_nr', 'branch', 'storage_room', 'shelf', 'last_modified'];

  constructor(
    private materialCheckOutService: MaterialCheckBoxService,
    private dataService: DataService,
  ) {

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?

      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  filterActive(material): TableArticleDataItem[] {
    var filteredData: TableArticleDataItem[] = [];
    for (var mat of material) {
      if (mat.status === "checked_in" || mat.status === "checked_out") {
        filteredData.push(mat);
      }
    }
    return filteredData;
  }

  transformData(requestData) {
    var data = [];
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    for (const d of requestData) {

      var tmp = {
        "material_number": d["material_number"],
        "reference_number": d["reference_number"],
        "branch": d["branch"],
        "storage_room": d["storage_room"],
        "shelf": d["shelf"],
        "package_number": d["package"],
        "status": d["status"],
        "timestamp": d["timestamp"],
        "last_modified": this.capitalizeFirstLetter(new Date(d["last_modified"] * 1000).toLocaleDateString("sv-SE", dateOptions))
      };

      data.push(tmp);
    }
    return data;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.storageRoom = new StorageRoomStore();
    console.log("Storage room:" + this.storageRoom.getStorageRoom().id);
    //TODO: The call should be changed to this when it is possible to access a correct Storage room.
    //this.dataService.sendGetRequest("/article/storageroom/" + this.storageRoom.getStorageRoom().id).subscribe((data: any[])=>{
    //TODO: Make search directly instead with storage_room chosen as option

    this.dataService.sendGetRequest("/article").subscribe((data: any[]) => {
      data = this.filterActive(data);
      this.dataSource = new TableArticleDataDataSource(this.transformData(data));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    })

    this.selection.changed.subscribe(newSelection => {
      this.materialCheckOutService.update(this.selection);
    });
  }


  setTableData(data) {
    this.dataSource = new TableArticleDataDataSource(this.transformData(data));
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

}
