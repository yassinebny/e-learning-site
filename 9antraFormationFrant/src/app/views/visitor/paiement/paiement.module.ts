import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingPaiementComponent } from './training-paiement/training-paiement.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaiementRoutingModule} from "./paiement-routing.module";
import { RequestsentdetailsComponent } from './requestsentdetails/requestsentdetails.component';
import { SchedulingComponent } from './calendarscheduling/scheduling/scheduling.component';
import {
  DayService, DragAndDropService, MonthAgendaService, MonthService,
  RecurrenceEditorModule, ResizeService,
  ScheduleModule, TimelineMonthService, TimelineViewsService,
  WeekService,
  WorkWeekService
} from "@syncfusion/ej2-angular-schedule";
import { SuccessComponent } from './successerrorpages/success/success.component';
import { ErrorComponent } from './successerrorpages/error/error.component';



@NgModule({
  declarations: [
    TrainingPaiementComponent,
    RequestsentdetailsComponent,
    SchedulingComponent,
    SuccessComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,  FormsModule,ScheduleModule,RecurrenceEditorModule,
    ReactiveFormsModule,PaiementRoutingModule
  ],
  providers : [DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService]
})
export class PaiementModule { }
