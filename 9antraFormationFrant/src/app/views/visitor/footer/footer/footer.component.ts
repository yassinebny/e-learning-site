import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgModel, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/MesServices/Company/company.service';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { ProjectOwnerService } from 'src/app/MesServices/ProjectOwner/project-owner.service';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import { Company } from 'src/app/Models/Company';
import { ProjectOwner } from 'src/app/Models/ProjectOwner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  AddCoach!: FormGroup;

  Role = 'COACH';
  Addetat!: boolean;
  uploadSuccess: boolean = false;
  imagepath = '';
  msjEtat: string = '';
  uploadInProgress: boolean = false;
  showSuccessIcon: boolean = false;
  showSuccessMessage = false;

  Allformation: any = [];
  isLoading: boolean = false;
  constructor(
    private UserService: UserService,
    private FormationsService: FormationsService,
    private authService: UserAuthService,
    private formBuilder: FormBuilder,
    private projectOwnerService: ProjectOwnerService,
    private router: Router,
    private sp: CompanyService
  ) {}

//   AddCoachForm() {
//     const formData = new FormData();
//     formData.append('username', this.AddCoach.get('fusername')?.value);
//     formData.append('firstName', this.AddCoach.get('fFirstName')?.value);
//     formData.append('lastName', this.AddCoach.get('fLastName')?.value);
//     formData.append('password', this.AddCoach.get('fPhoneNumber')?.value);
//     formData.append('numeroTel', this.AddCoach.get('fPhoneNumber')?.value);
//     formData.append('CV', this.AddCoach.get('CV')?.value);
//     formData.append('typeFormation', this.AddCoach.get('fSkills')?.value);
//     formData.append('country', this.AddCoach.get('fCountry')?.value);
//     formData.append('Github', this.AddCoach.get('fGithub')?.value);
//     formData.append('Linkedin', this.AddCoach.get('fLinkedin')?.value);
//     formData.append('skills', this.AddCoach.get('fSkills')?.value);
//     formData.append('photo', this.AddCoach.get('fileName')!.value);
//     formData.append('roles', this.Role);
//     formData.append('about', this.AddCoach.get('fabout')?.value);

//     this.isLoading = true;
//     this.uploadInProgress = true;

// Allformation: any = [];
// isLoading: boolean = false;
// constructor(
// private  UserService: UserService,
// private FormationsService: FormationsService,
//   private formBuilder: FormBuilder,
// ) {
// }
AddCoachForm() {
  const formData = new FormData();
  formData.append('username', this.AddCoach.get('fusername')?.value);
  formData.append('firstName', this.AddCoach.get('fFirstName')?.value);
  formData.append('lastName', this.AddCoach.get('fLastName')?.value);
  formData.append('password', this.AddCoach.get('fPhoneNumber')?.value);
  formData.append('numeroTel', this.AddCoach.get('fPhoneNumber')?.value);
  formData.append('CV', this.AddCoach.get('CV')?.value);
  formData.append('typeFormation', this.AddCoach.get('fSkills')?.value);
  formData.append('country', this.AddCoach.get('fCountry')?.value);
  formData.append('Github', this.AddCoach.get('fGithub')?.value);
  formData.append('Linkedin', this.AddCoach.get('fLinkedin')?.value);
  formData.append('skills', this.AddCoach.get('fSkills')?.value);
  formData.append('photo', this.AddCoach.get('fileName')!.value);
  formData.append('roles', this.Role);
  formData.append('about', this.AddCoach.get('fabout')?.value);




  this.isLoading = true;
  this.uploadInProgress = true;

  this.UserService.ajoutFormateur(formData).subscribe(
    (data: any) => {
      console.log(data);
      this.Addetat = true;
      this.showSuccessIcon = true;
      this.msjEtat = "Ajout avec succès";
      this.uploadInProgress = false; // Set upload in progress to false when upload is complete
      this.isLoading = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Thank you for your registration. We will contact you as soon as possible.',
        showConfirmButton: true,

      }) .then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      })

    },

    //   console.log(error);
    //   this.showSuccessIcon = false;
    //   this.Addetat = true;
    //   this.uploadInProgress = false;
    //   this.isLoading = false;

    //   if (error.status === 400 && error.error?.message === 'Error: Email is already taken!') {
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       title:
    //         'Thank you for your registration. We will contact you as soon as possible.',
    //       showConfirmButton: true,
    //     });
    //   }},
      (error) => {
        console.log(error);
        this.showSuccessIcon = false;
        this.Addetat = true;
        this.uploadInProgress = false;
        this.isLoading = false;

        if (
          error.status === 400 &&
          error.error?.message === 'Error: Email is already taken!'
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The email is already taken.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      }

);
}

  // Function to check if an email address is valid

  getALLFormations() {
    this.FormationsService.getFormations().subscribe((data) => {
      this.Allformation = data;
      console.log(this.Allformation);
    });
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.AddCoach.get('CV')!.setValue(file);
      this.uploadInProgress = true; // Set upload in progress to true when file selection starts
      setTimeout(() => {
        this.uploadInProgress = false;
        this.showSuccessMessage = true;
      }, 1000);
    } else {
      this.AddCoach.get('CV')!.setValue(this.imagepath);
      this.uploadInProgress = false; // Set upload in progress to false when no file is selected
    }
  }

  /*
onFileSelected(event: any) {
  this.uploadInProgress = true;

  // Simulating file upload with a delay of 2 seconds
  setTimeout(() => {
    this.uploadInProgress = false;
    this.showSuccessMessage = true;
  }, 1000);
}
*/

  get f() {
    return this.AddCoach.controls;
  }

  ngOnInit(): void {
    this.getALLFormations();

    this.AddCoach = this.formBuilder.group({
      fusername: ['', [Validators.required, Validators.email]],
      fFirstName: ['', [Validators.required]],
      fLastName: ['', [Validators.required]],
      fPhoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern('[0-9]*'),
        ],
      ],
      // fFormation: ['',[Validators.required]],
      CV: ['', [Validators.required]],
      fGithub: ['', [Validators.required ,Validators.pattern('https?://github.com/.+')]],
      fLinkedin: ['', [Validators.required,  Validators.pattern('https?://www.linkedin.com/.+')]],
      fCountry: ['Select Country', [Validators.required]],
      fSkills: ['', [Validators.required]],
      photo: [''],
      fileName: '',
    });
  }
  isLoggedIn2(): boolean {
    return this.authService.isLoggedIn2();
  }
  //// contributor
  file: File | null = null;
  project: ProjectOwner = new ProjectOwner();
  imagePreview: string | undefined;
  formSubmitted: boolean = false;
  formSubmitteds: boolean = false;
  isValidNumber(number: any) {
    // Regular expression to match numbers
    const numberRegex = /^\+?\d+$/;
    return numberRegex.test(number);
  }
  isValidEmail(email: any) {
    // Regular expression to match email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  save() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('nom', this.project.nom);
      formData.append('prenom', this.project.prenom);
      formData.append('numtel', this.project.numtel.toString());
      formData.append('email', this.project.email);
      formData.append('github', this.project.github);
      formData.append('linkedin', this.project.linkedin);

      this.projectOwnerService.createContributors(formData).subscribe(
        (data) => {
          console.log(data);
          this.imagePreview = undefined;

          this.project = new ProjectOwner();
          this.file = null;
          this.formSubmitted = true;
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        },
        (error) => console.log(error)
      );
    }
  }
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      // Générer l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }
  projects: Company = new Company();

  saveCompany() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('nom', this.projects.nom);
      formData.append('adresse', this.projects.adresse);
      formData.append('numtel', this.projects.numtel.toString());
      formData.append('email', this.projects.email);
      formData.append('description', this.projects.description);

      this.sp.createC(formData).subscribe(
        (data) => {
          console.log(data);
          this.imagePreview = undefined;

          this.projects = new Company();
          this.file = null;
          this.formSubmitteds = true;
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        },
        (error) => console.log(error)
      );
    }
  }

}
