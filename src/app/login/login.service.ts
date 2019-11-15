import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    let ret = this.http.get('http://localhost:9000/login/token', { withCredentials: true });
    console.log(ret);
    return ret;
  }

  logout() {
    return this.http.post('http://localhost:9000/logout', {}, { withCredentials: true });
  }
}
