import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GradientLinesComponent } from './gradient-lines/gradient-lines.component';
import { CirclesGradientComponent } from './circles-gradient/circles-gradient.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'animation', component: CirclesGradientComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }