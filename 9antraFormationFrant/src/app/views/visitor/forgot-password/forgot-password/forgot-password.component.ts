import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  emaili: string;
  etat: boolean;
  msj: string;
  uploadInProgress: boolean = false;
  showSuccessIcon: boolean = false;
  showSuccessMessage = false;
  isLoading: boolean = false;
  Addetat!: boolean ;

  constructor(private sr: UserService, private router: Router) {
    this.emaili = '';
    this.etat = false;
    this.msj = '';

  }
  isLoadingg:boolean = false; // Add this variable to track the loading state
  save() {
    this.isLoadingg = true; // Set loading state to true
    let dateno = Date.now();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    let data: any = {
      "code": result,
      "email": this.emaili,
      "dateCreation": dateno
    };

    this.sr.genCode(data).subscribe(
      (res: any) => {
        localStorage.setItem('email', this.emaili.toString());
        Swal.fire({
          icon: 'success',
          title: 'success.',
          text: 'We sent you an email with a code  ',
        });
        this.router.navigate(['/verifyemail']);
      },
      (error: any) => {
        console.log(error);
        this.showSuccessIcon = false;
        this.Addetat = true;
        this.uploadInProgress = false; // Set upload in progress to false on error as well
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Email not found    ',
        });
      }
    );
  }
  isValidEmail(email:any) {
    // Regular expression to match email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    }

}
