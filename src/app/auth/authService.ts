import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private token: string;
  private helper = new JwtHelperService();

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.isUserLoggedIn.next(true);
      const user = this.decodeToken();
      this.user.next({ email: user.email });
    }
  }

  getCurrentUser() {
    return this.decodeToken();
  }

  decodeToken() {
    return this.helper.decodeToken(this.token);
  }

  login(res): void {
    this.setToken(res.token);
    this.isUserLoggedIn.next(true);
    this.user.next({ email: this.decodeToken().email });
  }

  logout(): void {
    this.isUserLoggedIn.next(false);
    this.user.next({});
    this.token = null;
    localStorage.removeItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
