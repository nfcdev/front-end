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
  filterCheckboxes: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['article_nr', 'case_nr', 'storage_room', 'shelf',
                      'status', 'timestamp', 'last_modified'];
           

  ngOnInit() {
    this.dataSource = new TableArticleDataDataSource();
    this.dataSource.filterPredicate = (data: TableArticleDataItem, filter: string) => {
      return filter.split(',').every((item: string) => data.status.indexOf(item) !== -1);
    };
    this.filterCheckboxes.subscribe((newFilterValue: string[]) => {
      this.dataSource.filter = newFilterValue.join(',');
    });
  }

  addFilter(change: MatCheckboxChange) {
    if (this.filterCheckboxes.value.some((a: string) => a === change.source.value)) {
      this.filterCheckboxes.next(this.filterCheckboxes.value.filter((a: string) => a !== change.source.value));
    } else {
      this.filterCheckboxes.next(this.filterCheckboxes.value.concat(change.source.value));
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.addFilter = this.addFilter;
  }
}
