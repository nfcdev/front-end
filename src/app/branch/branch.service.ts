import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class BranchService {
  constructor(private http: HttpClient) {}

  getBranches(): Observable<any> {
    return this.http.get("http://localhost:9000/branch");
  }

  changeBranch(): Observable<any> {
    return this.http.get("http://localhost:9000/login/admin", {});
  }
}
