import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, find, filter, every, tap, flatMap } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { TableArticleDataComponent } from './table-article-data.component';

const BACKEND_URL = `${environment.URL}`;

@Injectable({
  providedIn: 'root',
})
export class TableDataService {

  constructor(){
    console.log("CONSTRUCTOR");
    
  }

  table: TableArticleDataComponent;

  setTable(table: TableArticleDataComponent) {
    console.log("Table was set: ", table);
    this.table = table;
  }

  refreshData() {
    this.table.refresh();
  }

}
