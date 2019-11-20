import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MaterialCheckBoxService } from './material-check-box.service';

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
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
  
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

  ngOnInit() {
    this.dataSource = new TableArticleDataDataSource();
    this.selection.changed.subscribe(newSelection => {
      this.materialCheckOutService.update(this.selection);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
