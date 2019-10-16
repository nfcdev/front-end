import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    // This just prints the result, remove later. 
    console.log(this.loginForm.value);
    // TODO: Request authentication/verification from back-end
    // TODO: Add an action if the verification fails
    this.router.navigate(['/main']);
  }

}
