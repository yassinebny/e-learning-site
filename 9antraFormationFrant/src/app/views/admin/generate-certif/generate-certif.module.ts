import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateCertifRoutingModule } from './generate-certif-routing.module';
import { GenerateCertifComponent } from './generate-certif.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [GenerateCertifComponent],
  imports: [
    CommonModule,FormsModule,
    GenerateCertifRoutingModule
  ]
})
export class GenerateCertifModule { }
