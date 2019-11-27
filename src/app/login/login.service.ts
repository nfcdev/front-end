import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.URL}`;

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
    console.log("user", user);
    return this.http.post(`${BACKEND_URL}/login`, user);
  }

  getToken(): Observable<any> {
    let ret = this.http.get(`${BACKEND_URL}/login/token`, { withCredentials: true });
    console.log(ret);
    return ret;
  }

  logout() {
    // return this.http.post('http://localhost:9000/logout', {}, { withCredentials: true });
    console.log("---Mocked logout---");

    return new BehaviorSubject<any>({});
  }
}
