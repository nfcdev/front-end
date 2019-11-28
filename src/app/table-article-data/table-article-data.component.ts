import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MaterialCheckBoxService } from './material-check-box.service';
import { Option, activeStatuses, inactiveStatuses } from '../search-bar/search-bar.component';
import { DataService } from '../data.service';
import { StorageRoomStore } from '../storage-room/storage-room-store'


var dataSource: TableArticleDataDataSource;
var dataConstant: TableArticleDataItem [];
var activeMaterials: TableArticleDataItem [] = [];
var inactiveMaterials: TableArticleDataItem [] = [];
export function applyFilter(filter: Option) {
  var tempData: TableArticleDataItem[] = [];
  if (filter.category=="Fall") {
    for (let j = 0; j < dataSource.data.length; j++) {
      console.log(j, dataSource.data.length);
      if (dataSource.data[j].reference_number == filter.name) {
        tempData.push(dataSource.data[j]);
        console.log("Found one!")
      }
    }
    dataSource.data = tempData;
  }
  if (filter.category=="Material") {
    for (let j = 0; j < dataSource.data.length; j++) {
      if (dataSource.data[j].material_number == filter.name) {
        tempData.push(dataSource.data[j]);
      }
    }
    dataSource.data = tempData;
  }
  if (filter.category=="Avdelning") {
    for (let j = 0; j < dataSource.data.length; j++) {
      if (dataSource.data[j].storage_room == filter.name) {
        tempData.push(dataSource.data[j]);
      }
    }
    dataSource.data = tempData;
  }
  if (filter.category=="Status") {
    for (let j = 0; j < dataSource.data.length; j++) {
      if (dataSource.data[j].status == filter.name) {
        tempData.push(dataSource.data[j]);
      }
    }
    dataSource.data = tempData;
  }
  if (filter.category=="Hylla") {
    for (let j = 0; j < dataSource.data.length; j++) {
      if (dataSource.data[j].shelf == filter.name) {
        tempData.push(dataSource.data[j]);
      }
    }
    dataSource.data = tempData;
  }

  console.log(dataSource.data);
  // TODO: Some way to refresh the table.
}

export function updateFilters(filters: Option []) {
  dataSource.data = dataConstant;
  for (let i = 0; i < filters.length; i++) {
    applyFilter(filters[i]);
  }
}

export function includeActiveMaterials(filters: Option []) {
  dataConstant = activeMaterials;
  updateFilters(filters);
}
export function includeInactiveMaterials(filters: Option []) {
  dataConstant = inactiveMaterials;
  updateFilters(filters);
}
export function includeAllMaterials(filters: Option []) {
  dataConstant = inactiveMaterials.concat(activeMaterials);
  updateFilters(filters);
}


@Component({
  selector: 'app-table-article-data',
  templateUrl: './table-article-data.component.html',
  styleUrls: ['./table-article-data.component.less']
})
export class TableArticleDataComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<TableArticleDataItem>;

  dataSource: TableArticleDataDataSource;
  storageRoom: StorageRoomStore;
  selection = new SelectionModel(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'case_nr', 'article_nr', 'package_nr', 'branch', 'storage_room', 'shelf','last_modified' ];

  constructor(
    private materialCheckOutService: MaterialCheckBoxService,
    private dataService: DataService,
  ) { }

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        dataSource.data.forEach(row => this.selection.select(row));
  }

transformData(requestData) {
  var data = [];
  for (const d of requestData) {
    var tmp = {"material_number": d["material_number"],
               "reference_number": d["reference_number"],
               "branch": d["branch"],
               "storage_room": d["storage_room"],
               "shelf": d["shelf"],
               "package": d["package"],
               "status": d["status"],
               "timestamp": d["timestamp"],
               "last_modified": d["last_modified"]
               };

    data.push(tmp);
  }
  return data;
}

  ngOnInit() {
    this.dataSource = new TableArticleDataDataSource();
    // Get all of the active materials
    for (let i = 0; i < activeStatuses.length ; i ++) {
      for (let j = 0; j < this.dataSource.data.length ; j ++) {
        if (this.dataSource.data[j].status == activeStatuses[i]) {
          activeMaterials.push(this.dataSource.data[j]);
        }
      }
    }
    // Get all of the inactive materials
    for (let i = 0; i < inactiveStatuses.length ; i ++) {
      for (let j = 0; j < this.dataSource.data.length ; j ++) {
        if (this.dataSource.data[j].status == inactiveStatuses[i]) {
          inactiveMaterials.push(this.dataSource.data[j]);
        }
      }
    }
    dataConstant = activeMaterials;
    this.dataSource.data = dataConstant;

    this.storageRoom = new StorageRoomStore();
    console.log("Storage room:" + this.storageRoom.getStorageRoom());
    //TODO: The call should be changed to this when it is possible to access a correct Storage room.
    //this.dataService.sendGetRequest("/article/storageroom/" + this.storageRoom.getStorageRoom()).subscribe((data: any[])=>{
    this.dataService.sendGetRequest("/article").subscribe((data: any[])=>{
      this.dataSource = new TableArticleDataDataSource(this.transformData(data));
      console.log(this.dataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    })

    //this.dataSource = new TableArticleDataDataSource(data);
    this.selection.changed.subscribe(newSelection => {
      this.materialCheckOutService.update(this.selection);
    });
  }

}
