import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TrainingPaiementComponent} from "./training-paiement/training-paiement.component";
import {RequestsentdetailsComponent} from "./requestsentdetails/requestsentdetails.component";
import {SchedulingComponent} from "./calendarscheduling/scheduling/scheduling.component";
import {SuccessComponent} from "./successerrorpages/success/success.component";
import {ErrorComponent} from "./successerrorpages/error/error.component";


const routes: Routes = [
  {path:'',component:TrainingPaiementComponent},
  { path: 'requestdetails/:id',component: RequestsentdetailsComponent},
  { path: 'appointment',component: SchedulingComponent},
  { path: 'paymentSuccess', component: SuccessComponent },
  { path: 'paymentError', component: ErrorComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
