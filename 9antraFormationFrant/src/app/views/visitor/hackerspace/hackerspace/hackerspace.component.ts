import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HackerspacesService } from 'src/app/MesServices/Hackerspaces/hackerspaces.service';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hackerspace',
  templateUrl: './hackerspace.component.html',
  styleUrls: ['./hackerspace.component.css'],
})
export class HackerspaceComponent implements OnInit {
  hackTab: any = [];
  parameterValue: any;
  region: any;
  location: any;
  email: any;
  phone: any;
  description: any;
  photo!: any;

  path: string = 'assets/Documents/';
  adresse!: string;
  constructor(
    private hackerspaceService: HackerspacesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  getALlByregion(nom: any): Observable<any> {
    return this.hackerspaceService.findHackerspaceByregion(nom);
  }

  ngOnInit(): void {
    //tbadel lrouter mn lac l gabes
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.parameterValue = params.get('region');
          return this.getALlByregion(this.parameterValue);
        })
      )
      .subscribe((res: any) => {
        this.hackTab = res;
        this.region = this.hackTab.region;
        this.location = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.hackTab.location
        );
        this.email = this.hackTab.email;
        this.phone = this.hackTab.phone;
        this.description = this.hackTab.description;
        this.photo = this.path + this.hackTab.photo;
        this.adresse = this.hackTab.adresse;
        this.displayImage();
      });
  }

  displayImage() {
    // Access this.photo here after it has been assigned
    console.log(this.photo);
  }
}
