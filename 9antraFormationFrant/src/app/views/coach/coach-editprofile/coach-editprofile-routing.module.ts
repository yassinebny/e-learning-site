import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachEditprofileComponent } from './coach-editprofile/coach-editprofile.component';

const routes: Routes = [
  {path:'Edit',component:CoachEditprofileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachEditprofileRoutingModule { }
