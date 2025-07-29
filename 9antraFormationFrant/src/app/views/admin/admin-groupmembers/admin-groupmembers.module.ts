import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AdminGroupmembersRoutingModule } from './admin-groupmembers-routing.module';
import { AdminGroupmembersComponent } from './admin-groupmembers/admin-groupmembers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AdminGroupmembersComponent],
  imports: [    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    AdminGroupmembersRoutingModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule, // Ajoutez cette ligne



  ],
})
export class AdminGroupmembersModule {}
