import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {BehaviorSubject} from 'rxjs';
import { TableArticleDataDataSource, TableArticleDataItem } from './table-article-data-datasource';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  
  
  
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['article_nr', 'case_nr', 'storage_room', 'shelf',
                      'status', 'timestamp', 'last_modified'];
                     

  ngOnInit() {
    this.dataSource = new TableArticleDataDataSource();
    
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    
  }
}
