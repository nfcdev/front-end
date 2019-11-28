import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private REST_API_SERVER = `${environment.URL}`;

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

  public sendPostRequest(request:string, data){
    return this.httpClient.post(this.REST_API_SERVER + request, data, httpOptions).pipe(catchError(this.handleError));
  }

  public sendPutRequest(request:string, data){
    return this.httpClient.put(this.REST_API_SERVER + request, data, httpOptions).pipe(catchError(this.handleError));
  }

  public sendDeleteRequest(request:string){
    return this.httpClient.get(this.REST_API_SERVER + request).pipe(retry(2), catchError(this.handleError));
  }

}
