import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, find, filter, every, tap, flatMap } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { TableArticleDataComponent } from './table-article-data.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

const BACKEND_URL = `${environment.URL}`;

@Injectable({
  providedIn: 'root',

})
export class TableDataService {

  constructor(){
    console.log("CONSTRUCTOR");
    
  }
  
  searchBar: SearchBarComponent;
  table: TableArticleDataComponent;

  setTable(table: TableArticleDataComponent) {
    console.log("Table was set: ", table);
    this.table = table;
  }
  
  setSearchBar(searchBar: SearchBarComponent) {
    this.searchBar = searchBar;
  }

  refreshData() {
    this.table.refresh();
  }
  resetSelection(){
    this.table.resetSelection();
    this.searchBar.search();
  }

}
