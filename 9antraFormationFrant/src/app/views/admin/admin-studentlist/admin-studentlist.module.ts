import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminStudentlistRoutingModule } from './admin-studentlist-routing.module';
import { AdminStudentlistComponent } from './admin-studentlist/admin-studentlist.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminStudentlistComponent
  ],
  imports: [
    CommonModule,
    AdminStudentlistRoutingModule,FormsModule
  ]
})
export class AdminStudentlistModule { }
