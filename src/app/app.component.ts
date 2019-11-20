import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './auth/authService';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [LoginService]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router, private loginService: LoginService) {}
  userLoggedIn = false;
  user = {};
  title = 'front-end';

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      console.log("user",user);
      this.user = user;
    });

    this.authService.isUserLoggedIn.subscribe(loggedIn => {
      console.log("loggedIn",loggedIn);
      
      this.userLoggedIn = loggedIn;
    });
  }

  logOut(): void {
    this.authService.logout();
    // TODO: Do we really have to connect to the backend here? Can't it be enough to just clear the local store from the token?
    this.loginService.logout().subscribe(res => {
      console.log('Res: ', res);
      this.router.navigate(['/']);
    });
  }
}
