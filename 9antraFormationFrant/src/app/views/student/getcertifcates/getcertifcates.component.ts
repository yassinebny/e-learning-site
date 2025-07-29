import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CertificatService } from 'src/app/MesServices/Certificat/certificat.service';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';
import { Certificat } from 'src/app/Models/Certificat';
import { User } from 'src/app/Models/user.model';

@Component({
  selector: 'app-getcertifcates',
  templateUrl: './getcertifcates.component.html',
  styleUrls: ['./getcertifcates.component.css']
})
export class GetcertifcatesComponent implements OnInit {
  constructor(  private  sr : UserService, private route: ActivatedRoute,private projectService: CertificatService, private sanitizer: DomSanitizer) { }
  adminProjectId: Certificat[] = [];
  projectsq: User = new User();

  project: Certificat = new Certificat();
  formationNames: string[] = [];

  ngOnInit(): void {

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.projectService.getUserCertificates(id).subscribe(
        (event: Certificat[]) => {
          this.adminProjectId = event;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
   

    if (id) {
      this.projectService.getUserCertificatesFormationNames(id).subscribe(
        (response: string[]) => {
          this.formationNames = response;
        },
        (error) => {
          console.error('Error fetching formation names:', error);
        }
      );
    }
    this.get(id);
  }
 
  getSafeUrl(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('assets/' + path);
  }

  get(projectId: number): void {
   
    this.sr.getById2(projectId).subscribe(
      (projectsq: User) => {
        this.projectsq = projectsq;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
