import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { tap, catchError, map } from "rxjs/operators";
import { AuthenticationService } from "./authService";

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if logged in
    // TODO: Change to user store

    return next.handle(request).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      if (error.status == 401) {
        this.router.navigateByUrl("/");
        this.authService.logout();
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    }
    // return an observable with a user-facing error message
    return throwError(error);
  };
}
