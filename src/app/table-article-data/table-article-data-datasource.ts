import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import articleData from './example_data.json';

export interface TableArticleDataItem {
  material_number: string;
  case: number;
  storage_room: number;
  placement: string;
  action: string;
  timestamp: number;
}

const EXAMPLE_DATA: TableArticleDataItem[] = articleData;

export class TableArticleDataDataSource extends DataSource<TableArticleDataItem> {
  data: TableArticleDataItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableArticleDataItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}


  private getPagedData(data: TableArticleDataItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: TableArticleDataItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'article_nr': return compare(a.material_number, b.material_number, isAsc);
        case 'case_nr': return compare(+a.case, +b.case, isAsc);
        case 'storage_room': return compare(+a.storage_room, +b.storage_room, isAsc);
        case 'placement': return compare(+a.placement, +b.placement, isAsc);
        case 'action': return compare(+a.action, +b.action, isAsc);
        case 'timestamp': return compare(+a.timestamp, +b.timestamp, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
