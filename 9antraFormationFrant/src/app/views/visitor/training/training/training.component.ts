import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { FeedbackService } from 'src/app/MesServices/Feedback/feedback.service';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategorieService } from 'src/app/MesServices/Categorie/categorie.service';
import {RequestService} from "../../../../MesServices/Request/request.service";
import {UserAuthService} from "../../../../MesServices/user-auth.service";
import {Validators} from "@angular/forms";
import {GroupService} from "../../../../MesServices/Groups/group.service";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {

  id!: any;
  tabCategorie: any = [];
  Categorie = '';
  tabFormation: any = [];
  tabFeedback: any = [];
  parameterValue!: any;
  chapitres: any;
  exercices: any;
  projects: any;
  nomFormation: any;
  descriptionFormation: any;
  workspaces: any;
  price:any;
  startDate:any;
  posibility: any;
  userLoggedIn: boolean = false
  ListChapters: any = [];
  constructor(
    private fs: FormationsService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private fedb: FeedbackService,
    private cs: CategorieService,
    private request:RequestService,
    private userauth:UserAuthService,private router:Router
  ) {
    this.parameterValue = this.route.snapshot.paramMap.get('formation');
  }
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0).map((_, index) => index);
  }
  emailuser:any;
  requests:any=[];
  groups: any[] = [];
  datas:any;
  getONlineNotPaidRequests()
  {
    const email = localStorage.getItem('email');
    if (email) {
      // Remove leading and trailing quotes if they exist
      this.emailuser= email.replace(/^"(.*)"$/, '$1');}

    this.fs.getFormationByNomFormation(this.parameterValue)
      .subscribe((data) => {
    this.request.getunpaidonlineRequestsByEmail(this.emailuser.toString()).subscribe(
      (res)=>{

        this.requests=res;
 console.log("resq",res);
console.log("paramvalue",this.parameterValue)
        this.datas=data;
        console.log("datas", this.datas)
        this.requests=this.requests.filter((f:any)=>f.formation.id=== this.datas.id)
        if (this.requests.length > 0) {

          this.groupService.getGroupsByFormation(this.datas.id).subscribe(
            (groups) => {
              this.groups = groups.filter(group => this.requests.some((reqst: any) => reqst.trainingPeriod === group.period));
              console.log("groups", groups);

            }
          );
        }
  },
      (error)=>
    {
      console.log(error)
    }
          )
      } )
  }
  getFormationBynomFormation() {
    this.fs
      .getFormationByNomFormation(this.parameterValue)
      .subscribe((data) => {
        console.log('adadada', data);
        this.tabFormation = data;
        this.chapitres = this.tabFormation.nbChapters;
        this.exercices = this.tabFormation.nbExercices;
        this.projects = this.tabFormation.nbProjects;
        this.nomFormation = this.tabFormation.nomFormation;
        this.descriptionFormation = this.tabFormation.description;
        this.workspaces = this.tabFormation.workspaces;
        this.price=this.tabFormation.price;
        this.startDate=this.tabFormation.startedDate;

        this.posibility = this.tabFormation.posibility;
        //loop for tabFormation and push chapters in ListChapters
        this.ListChapters = this.tabFormation.chapters;
        console.log('ListChapters', this.ListChapters);
      });
  }

  getAllFeedbacks() {
    this.fedb.getAllFeedbacks().subscribe((data) => {
      console.log('Dee', data);
    });
  }

  getFeedbackByFormation() {
    this.fedb.getFeedbackByFormation(this.parameterValue).subscribe((data) => {
      console.log('Wiouu', data);
      this.tabFeedback = data;
    });
  }
  getAllCategorie() {
    this.cs.getCategories().subscribe((res) => {
      this.tabCategorie = res;
      console.log(this.tabCategorie);
    });
  }
  getFormationByCategorie(categoryId: any) {
    this.fs.getFormationByCategorie(categoryId).subscribe((res) => {
      this.tabFormation = res;
      console.log(this.tabFormation);
    });
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.parameterValue = params.get('formation');
      this.getFormationBynomFormation();
      this.getFeedbackByFormation();
      this.getAllFeedbacks();
      this.getAllCategorie();
      this.getFormationByCategorie(this.id);
      this.userLoggedIn = this.userauth.isLoggedIn1();
      this.getONlineNotPaidRequests();
      this.getAveragePrice();
    });

  }

  getAveragePrice(): number {
    return this.requests.length ? this.price / this.requests.length : 0;
  }
}
