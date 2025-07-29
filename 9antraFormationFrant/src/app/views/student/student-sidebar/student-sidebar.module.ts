import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentSidebarRoutingModule } from './student-sidebar-routing.module';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';



@NgModule({
  declarations: [
    StudentSidebarComponent
  ],
  imports: [
    CommonModule,
    StudentSidebarRoutingModule
  ]
})
export class StudentSidebarModule { }
