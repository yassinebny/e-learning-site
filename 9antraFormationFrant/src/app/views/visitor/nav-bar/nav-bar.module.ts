import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotificationModule } from '../notification/notification.module';



@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    NavBarRoutingModule,
    NotificationModule
  ],
  exports:[NavBarComponent]
})
export class NavBarModule { }
