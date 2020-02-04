import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.URL}`;

@Injectable()
export class BranchService {
  constructor(private http: HttpClient) {}

  getBranches(): Observable<any> {
    return this.http.get(`${BACKEND_URL}/branch`);
  }

  changeBranch(): Observable<any> {
    return this.http.get(`${BACKEND_URL}/login/admin`, {});
  }
}
