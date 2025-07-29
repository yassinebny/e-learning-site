import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachCommentsComponent } from './coach-comments/coach-comments.component';

const routes: Routes = [
  {path:'comments',component:CoachCommentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachCommentsRoutingModule { }
