import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { AuthenticationService } from "../auth/authService";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService, private authService: AuthenticationService) { }

  u_shortcode: string;
  // u_password: string;

  ngOnInit() {
    this.authService.isUserLoggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        console.log("User is logged in!");
        this.router.navigate(["/main"]);
        return
      }
      console.log("User is not logged in!");
    });
  }

  login() {
    // This just prints the result, remove later.
    console.log("Running login function.");
    console.log("kortkod", this.u_shortcode);
    let user = {
      "name": this.u_shortcode
    }
    this.loginService.login(user).subscribe(res => {
      console.log("res", res);
      this.authService.login(res);
      this.router.navigate(["/main"]);
    });

    // TODO: Add an action if the login fails. User most be notified
    // It should be done in unauthorized.interceptor.ts and connected with observable
  }
}
