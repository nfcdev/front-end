import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private REST_API_SERVER = "http://localhost:9000";

  constructor(private httpClient: HttpClient) { }

  /*private handleError(operation = 'operation', result?: T) {
    return (error: any): Observable => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }*/

HttpErrorResponse
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }


  public sendGetRequest(request:string){
    return this.httpClient.get(this.REST_API_SERVER + request).pipe(retry(2), catchError(this.handleError));
  }
}
