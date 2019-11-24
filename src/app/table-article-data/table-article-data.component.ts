import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MaterialCheckBoxService } from './material-check-box.service';
import { Option } from '../search-bar/search-bar.component';

var dataSource: TableArticleDataDataSource;
var dataConstant: TableArticleDataItem [];
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
  console.log(dataSource.data);
  // TODO: Some way to refresh the table.
}

export function removeFilter(filters: Option []) {
  dataSource.data = dataConstant;
  for (let i = 0; i < filters.length; i++) {
    applyFilter(filters[i]);
  }
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
  // dataSource: TableArticleDataDataSource;
  selection = new SelectionModel(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select','article_nr', 'case_nr', 'storage_room', 'shelf',
                      'status', 'timestamp', 'last_modified'];

  constructor(
    private materialCheckOutService: MaterialCheckBoxService
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
    dataSource = new TableArticleDataDataSource();
    dataConstant = dataSource.data;
    this.selection.changed.subscribe(newSelection => {
      this.materialCheckOutService.update(this.selection);
    });
    console.log(dataSource.data);
  }

  ngAfterViewInit() {
    dataSource.sort = this.sort;
    dataSource.paginator = this.paginator;
    this.table.dataSource = dataSource;
  }
}
