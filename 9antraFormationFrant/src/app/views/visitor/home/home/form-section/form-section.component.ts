import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';
import Swal from 'sweetalert2';
import { RequestService } from 'src/app/MesServices/Request/request.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import {GroupService} from "../../../../../MesServices/Groups/group.service";
import {Request} from "../../../../../Models/Request";

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.css'],
})
export class FormSectionComponent implements OnInit {
  AddStudent!: FormGroup;
  Role = 'ETUDIANT';
  Addetat!: boolean;
  msjEtat: string = '';
  Allformation: any = [];
  isLoading: boolean = false;
  showSuccessIcon: boolean = false;
  uploadInProgress: boolean = false;
  groups: any[] = [];
  findperiod: boolean | null = null; // Initialize as null
  constructor(
    private FormationsService: FormationsService,
    private rs: RequestService,
    private UserService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: UserAuthService,
    private groupService: GroupService,
  ) {
    this.Addetat = false;
    this.msjEtat = '';
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn2();
  }
  result!:Request;
  AddStudentForm() {

    const formData = new FormData();

    const form = {
      firstName: this.AddStudent.get('fFirstName')?.value,
      lastName: this.AddStudent.get('fLastName')?.value,
      country: this.AddStudent.get('fCountry')?.value,
      phoneNumber: this.AddStudent.get('fPhoneNumber')?.value,
      email: this.AddStudent.get('fusername')?.value,
      paiementType:this.AddStudent.get('paymentMethod')?.value,
      trainingPeriod:this.AddStudent.get('trainingMonth')?.value,
      educationPlace:'PENDING'
    }
    let idFormation = this.AddStudent.get('fFormation')?.value

    this.isLoading = true;
    this.uploadInProgress = true;
if(this.AddStudent.get('trainingMonth')?.value==="Select Training Period")
{
  form.trainingPeriod="pending";
}
    console.log(this.Allformation);

    formData.append('request', JSON.stringify(form));
        this.rs.addRequest(formData, idFormation).subscribe(
        (data: Request) => {
          this.Addetat = true;
          this.showSuccessIcon = true;
          this.uploadInProgress = false;
            this.result=data;

          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title:
              'Thank you for your registration. We sent you an email',
            showConfirmButton: true,

          }).then((result) => {
            if (result.isConfirmed) {


              window.location.href = `/payment/requestdetails/${this.result?.id}`;
window.location.reload()


            }
          });
        },
        (error) => {
          console.log(error);

          this.showSuccessIcon = false;
          this.Addetat = true;
          this.uploadInProgress = false;
          this.isLoading = false;
if(error.error=="You already sent a request!")
{
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You already sent a request!',
  });
}
else
if(error.error=="You already Paid for this training!")
{
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You already Paid for this training!',
  });
}
else
if(error.error=="You already Paid for period 2 of this training!")
          {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You already Paid for period 2 of this training!',
            });
          } else
          if(error.error=="You already sent a request for period 2 of this training we sent you an email for paiement!")
          {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You already sent a request for period 2 of this training we sent you an email for paiement!',
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        }

      )
      }



  isValidEmail(email: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let Email = this.authService.getUsername;
    if(emailRegex.test(email) && Email==email){
      return true
    }else{
      return false
    }
  }

  getALLFormations() {
    this.FormationsService.getFormations().subscribe((data) => {
      this.Allformation = data;
      console.log(this.Allformation);
    });
  }

  get f() {
    return this.AddStudent.controls;
  }

  ngOnInit(): void {

    this.getALLFormations();
    this.AddStudent = this.formBuilder.group({
      fusername: ['', [Validators.required, Validators.email]],
      fFirstName: ['', [Validators.required]],
      fLastName: ['', [Validators.required]],
      fPhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{8,}$/)]],
      fFormation: ['Select Training', [Validators.required]],
      fCountry: ['Select Country', [Validators.required]],
      paymentMethod: ['PENDING'],

      trainingMonth: ['Select Training Period', Validators.required],

    });


    // Subscribe to the fFormation value changes to get the groups of the formation
    this.AddStudent.get('fFormation')?.valueChanges.subscribe(selectedTrainingId => {
      if (selectedTrainingId) {
        this.groupService.getGroupsByFormation(selectedTrainingId).subscribe(
          (groups) => {
            this.groups = groups;
            if (groups.some(group => group.period)) {
              this.findperiod=true;
              this.AddStudent.get('trainingMonth')?.setValidators([Validators.required]);
            } else {
              this.findperiod=false;
              this.groups=[];
              this.AddStudent.get('trainingMonth')?.clearValidators();
              // Reset trainingMonth value if no periods available
              this.AddStudent.get('trainingMonth')?.reset('Select Training Period');
            }
            this.AddStudent.get('trainingMonth')?.updateValueAndValidity();
          }
        );
      }
    });
  }


  isValidNumber(number: any) {
    // Regular expression to match numbers
    const numberRegex = /^\+?\d{8,}$/;
    return numberRegex.test(number);
  }


}
