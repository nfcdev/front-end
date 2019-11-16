import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
    console.log("user", user);
    return this.http.post('http://localhost:9000/login', user);
  }

  getToken(): Observable<any> {
    let ret = this.http.get('http://localhost:9000/login/token', { withCredentials: true });
    console.log(ret);
    return ret;
  }

  logout() {
    // return this.http.post('http://localhost:9000/logout', {}, { withCredentials: true });
    console.log("---Mocked logout---");

    return new BehaviorSubject<any>({});
  }
}
