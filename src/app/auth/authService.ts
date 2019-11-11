import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public user: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private token: string;
  private helper = new JwtHelperService();

  constructor() {
    this.token = localStorage.getItem('user_id_token');
    if (this.token) {
      this.isUserLoggedIn.next(true);
      const user = this.decodeToken();
      this.user.next(user);
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
    this.user.next(this.decodeToken());
  }

  logout(): void {
    this.isUserLoggedIn.next(false);
    this.user.next({});
    this.token = null;
    localStorage.removeItem('user_id_token');
  }

  isUserAdmin(): boolean {
    return this.user.value.role == 'admin';
  }

  setToken(token) {
    localStorage.setItem('user_id_token', token);
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
