import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  pass1 = ""
  pass2 = ""
  email = localStorage.getItem("email")
  constructor(private sr: UserService, private router: Router) {

  }
  Change() {
    if (this.pass1 == this.pass2) {
      let data={
        "password":this.pass2
      }
       this.sr.changePassword(this.email,data).subscribe(res => {
        this.router.navigate(['/login']);

      })
    }
  }

  ngOnInit(): void {
    if(localStorage.getItem("code")==null)
    {
      this.router.navigate(['../forgotpassword']);
    }
  }

}
