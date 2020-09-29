import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { ViewMeetingComponent } from './view-meeting/view-meeting.component';

const routes: Routes = [
  { path: '', component: AddMeetingComponent },
  { path: 'view-schedules/:roomId', component: ViewMeetingComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports :[RouterModule]
})
export class AppRoutingModule { }
