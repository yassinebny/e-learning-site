import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
   
  ]
})
export class NotFoundModule { }
