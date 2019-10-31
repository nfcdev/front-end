import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { LoginService } from "./login.service";
import { AuthenticationService } from "../auth/authService";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(private router: Router, private loginService: LoginService, private authService: AuthenticationService) {}

  ngOnInit() {
    this.loginService.getToken().subscribe(resp => {
      this.authService.login(resp);
      this.router.navigate(["/main"]);
    });
  }

  onSubmit() {
    // This just prints the result, remove later.
    console.log(this.loginForm.value);

    // TODO: Request authentication/verification from back-end
    // TODO: Add an action if the verification fails
  }
}
