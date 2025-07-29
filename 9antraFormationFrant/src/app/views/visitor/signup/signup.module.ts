import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup/signup.component';
import {MatCardModule} from '@angular/material/card';
import { MaterialModule } from 'src/app/materiel/materiel.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SignupModule { }
