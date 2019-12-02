import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { TableArticleDataComponent } from './table-article-data.component';

export interface TableArticleDataItem {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package_number: string;
  status: string;
  timestamp: number;
  last_modified: number;
}



export class TableArticleDataDataSource extends DataSource<TableArticleDataItem> {
  data: TableArticleDataItem[] = [];
  paginator: MatPaginator;
  sort: MatSort;

  //Expected parameter data adheres to TableArticleDataItem content
  constructor(data) {
    super();
    this.data = data;
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

  updateData(data) {
    this.data = data;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }


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
        case 'case_nr': return compare(+a.reference_number, +b.reference_number, isAsc);
        case 'article_nr': return compare(a.material_number, b.material_number, isAsc);
        case 'package_nr': return compare(a.package_number, b.package_number, isAsc);
        case 'branch': return compare(a.branch, b.branch, isAsc);
        case 'storage_room': return compare(a.storage_room, b.storage_room, isAsc);
        case 'shelf': return compare(a.shelf, b.shelf, isAsc);
        case 'last_modified': return compare(+a.last_modified, +b.last_modified, isAsc);

        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


