import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableArticleDataDataSource } from './table-article-data/table-article-data-datasource';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  searchOption=[];
  public postsData: TableArticleDataDataSource;
  postUrl :string = "https://jsonplaceholder.typicode.com/posts";
  
  constructor(private http:HttpClient) { }
  getPosts(): Observable<TableArticleDataDataSource>{
    return this.http.get<TableArticleDataDataSource>(this.postUrl);
  }
}
