import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { AdminChaptersComponent } from './views/admin/admin-chapters/admin-chapters/admin-chapters.component';
import { AuthInterceptor } from './Helpers/auth-interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire/compat';
import { environement } from 'src/environement/environement.dev';
import { ProjectMemberComponent } from './views/coach/project-member/project-member.component';
import { LayoutsModule } from './layouts/layouts.module';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './views/visitor/chatbot/chatbot.component';
import { StompService } from './MesServices/StompService/stomp.service';
import {
  DayService, MonthAgendaService, MonthService,
  RecurrenceEditorModule,
  ScheduleModule,
  WeekService,
  WorkWeekService
} from "@syncfusion/ej2-angular-schedule";







@NgModule({
  declarations: [AppComponent, ProjectMemberComponent, ChatbotComponent],
  imports: [
    ScheduleModule,RecurrenceEditorModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environement.firebase),
    //AngularFireAuthModule,
    MatDialogModule,
    MatSnackBarModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,

    },
    DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService,
    StompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
