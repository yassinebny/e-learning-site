import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/MesServices/Event/event.service';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { ProjectService } from 'src/app/MesServices/Projects/projects.service';
import { SessionService } from 'src/app/MesServices/Session/session.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import { Session } from 'src/app/Models/Session';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  studentProjectsCount!: number;
  formationsInProgressCount:any;
  formationsCompletedCount:any=0;
  eventsCount:any;
  userId:any
  sessions:any
  userEmail: string = '';
  photo:any
  constructor(private projectService: ProjectService,
    private formationService:FormationsService,
    private authService:UserAuthService,
    private eventService:EventService,
    private sessionService:SessionService
    ) {
    this.userId=this.authService.getId();

   }

  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      // Remove leading and trailing quotes if they exist
      this.userEmail = email.replace(/^"(.*)"$/, '$1');
      console.log('Retrieved email from localStorage:', this.userEmail);
    } else {
      console.error('Email not found in localStorage');
    }







    this.getStudentProjectsCount();
    this.getCountFormationsInProgressByUserId();
    this.getCountFormationsCompletedByUserId();
    this.getCountEventsByUserId();
    this.getSessionByFormationId();
  }

  getStudentProjectsCount() {
    this.projectService.getStudentProjectsCount()
      .subscribe(
        count => {
          this.studentProjectsCount = count;
        },
        error => {
          console.error('Error retrieving student projects count:', error);
        }
      );
  }

  getCountFormationsInProgressByUserId(){
    this.formationService.getCountFormationsInProgressByUserId(this.userId).subscribe((res:any)=>{
     this.formationsInProgressCount = res;
    }),
    (error:any)=>{
      console.log(error);
    }
    }

    getCountFormationsCompletedByUserId(){
      this.formationService.getCountFormationsCompletedByUserId(this.userId).subscribe((res:any)=>{
       this.formationsCompletedCount = res;
      }),
      (error:any)=>{
        console.log(error);
      }
      }

    getCountEventsByUserId(){
      this.eventService.getCountEventsByUserId(this.userId).subscribe((res:any)=>{
       this.eventsCount = res;
      }),
      (error:any)=>{
        console.log(error);
      }
      }

    isSessionExpired(session: Session): boolean {
      const currentDate = new Date();
      const sessionEndDate = new Date(session.finishDate);

      return sessionEndDate < currentDate;
    }
/* fixed by me nour chawebi */
    getSessionByFormationId(){

      this.userEmail=this.userEmail.toString()

      this.sessionService.getSessionByFormationId(this.userEmail).subscribe((res:any)=>{
        this.sessions = res;
        console.log("session by formation",res)
        }),
        (error:any)=>{
          console.log(error);
        }
    }

    convertNumberToMonth(number: any): string {
      let monthName: string = '';
      switch (number) {
          case "01":
              monthName = 'January';
              break;
          case "02":
              monthName = 'February';
              break;
          case "03":
              monthName = 'March';
              break;
          case "04":
              monthName = 'April';
              break;
          case "05":
              monthName = 'May';
              break;
          case "06":
              monthName = 'June';
              break;
          case "07":
              monthName = 'July';
              break;
          case "08":
              monthName = 'August';
              break;
          case "09":
              monthName = 'September';
              break;
          case "10":
              monthName = 'October';
              break;
          case "11":
              monthName = 'November';
              break;
          case "12":
              monthName = 'December';
              break;
          default:
              monthName = 'Invalid month';
      }
      return monthName;
  }
}
