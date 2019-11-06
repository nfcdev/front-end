import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    return this.http.get('http://localhost:9000/login/token', { withCredentials: true });
  }

  logout() {
    return this.http.post('http://localhost:9000/logout', {}, { withCredentials: true });
  }
}
