import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecificOfferService } from 'src/app/MesServices/specific-Offer/specific-offer.service';
import { SpecificOffer } from 'src/app/Models/SpecificOffer';
import { SpecificProject } from 'src/app/Models/SpecificProject';

@Component({
  selector: 'app-specific-offer',
  templateUrl: './specific-offer.component.html',
  styleUrls: ['./specific-offer.component.css']
})
export class SpecificOfferComponent implements OnInit{
  projectData: FormData = new FormData();
  formSubmitted: boolean = false;
  ngOnInit(): void {
    this.project.experience = ""; // Initialise avec une valeur vide pour la sélection par défaut
    this.project.education = ""; // Initialise avec une valeur vide pour la sélection par défaut
    this.project.type = ""; // Initialise avec une valeur vide pour la sélection par défaut

  }
  project: SpecificOffer = new SpecificOffer();
  constructor(private sp :SpecificOfferService, private router: Router){}
  file: File | null = null;
  addProject() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('poste', this.project.poste);
      formData.append('numtel', this.project.numtel.toString());
      formData.append('skills', this.project.skills);
      formData.append('description', this.project.description);
      formData.append('experience', this.project.experience);
      formData.append('type', this.project.type);
      formData.append('email', this.project.email);
      formData.append('education', this.project.education);
      formData.append('nom', this.project.nom);
      formData.append('descriptionC', this.project.descriptionC);
      formData.append('adresse', this.project.adresse);
  
      // Call the service to add the project
      this.sp.addOffer(formData).subscribe(
        response => {
          // Successful response, perform necessary actions
          console.log('Project added successfully', response);
          this.project = new SpecificOffer();
          this.formSubmitted = true;
          this.file = null;
        },
        error => {
          // Handle errors
          console.error('Error while adding the project', error);
        }
      );
    } else {
      // Handle case when file is not selected
      console.error('No file selected');
    }
  }
  imagePreview: string | null = null;

onFileChange4(event: Event) {
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
}
