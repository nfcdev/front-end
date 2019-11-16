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
  u_shortcode: string;
  u_password: string;

  constructor(private router: Router, private loginService: LoginService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.loginService.getToken().subscribe(resp => {
      console.log("resp", resp);

      this.authService.login(resp);
      this.router.navigate(["/main"]);
    });
  }

  login() {
    // This just prints the result, remove later.
    console.log("Running login function.");
    console.log("kortkod", this.u_shortcode);
    console.log("lösenord", this.u_password);
    // TODO: Request authentication/verification from back-end
    // TODO: Add an action if the verification fails
  }
}
