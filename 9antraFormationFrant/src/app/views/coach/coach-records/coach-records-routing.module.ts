import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachRecordsComponent } from './coach-records/coach-records.component';

const routes: Routes = [
  {path:':id/records',component:CoachRecordsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRecordsRoutingModule { }
