import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachGroupsModule } from './coach-groups.module';
import { CoachGroupsComponent } from './coach-groups/coach-groups.component';

const routes: Routes = [
  {path:'',component:CoachGroupsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachGroupsRoutingModule { }
