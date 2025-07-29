import {Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EventService } from 'src/app/MesServices/Event/event.service';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { SessionService } from 'src/app/MesServices/Session/session.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
Chart.register(...registerables);
@Component({
  selector: 'app-coach-home',
  templateUrl: './coach-home.component.html',
  styleUrls: ['./coach-home.component.css']
})
export class CoachHomeComponent  implements OnInit{
  completedTraining:any;
  progressTraining:any;
  eventsCount:any;
  userId:any;
  sessions:any;
  constructor(private formationService:FormationsService,private authService:UserAuthService,private eventService:EventService,private sessionService:SessionService){
    this.userId=this.authService.getId();
  }
  userEmail: string = '';


  getCountFormationsCompletedCoach(){
    this.formationService.getCountFormationsCompletedCoach(this.userId).subscribe((res:any)=>{
      this.completedTraining = res;
     }),
     (error:any)=>{
       console.log(error);
     }
  }

  getCountFormationsInProgressCoach(){
    this.formationService.getCountFormationsInProgressCoach(this.userId).subscribe((res:any)=>{
      this.progressTraining = res;
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
    getSessionByFormationCoachId(){
      this.sessionService.getSessionByFormationCoachId(this.userId).subscribe((res:any)=>{
        this.sessions = res;
        console.log("sessiosn",res)
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
  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      // Remove leading and trailing quotes if they exist
      this.userEmail = email.replace(/^"(.*)"$/, '$1');
      console.log('Retrieved email from localStorage:', this.userEmail);
    } else {
      console.error('Email not found in localStorage');
    }

    this.getCountFormationsInProgressCoach();
    this.getCountFormationsCompletedCoach();
    this.getCountEventsByUserId();
    this.getSessionByFormationCoachId();
     /*var myChart = new Chart("myChart", {
      type: 'pie',
      data: {
          datasets: [{
              label: 'Number of Votes',
              data: [23, 10, 3, 5],
              backgroundColor: [
                'rgba(34, 83, 84, 1)',
                  'rgba(224, 129, 14, 1)',
                  'rgba(164, 12, 63, 1)',
                  'rgba(54, 54, 54, 1)',
              ],

              borderRadius:5,
              borderWidth: 1
          }]
      },
      options: {

      }
    });*/
  }
}
