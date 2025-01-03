import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GradientLinesComponent } from './gradient-lines/gradient-lines.component';
import { CirclesGradientComponent } from './circles-gradient/circles-gradient.component';
import { ScrollingAppsComponent } from './scrolling-apps/scrolling-apps.component';
import { ScrollingAppsContainerComponent } from './scrolling-apps-container/scrolling-apps-container.component';
import { SffoldersPrivacyComponent } from './sffolders-privacy/sffolders-privacy.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'animation', component: ScrollingAppsContainerComponent },
  { path: 'sf-folders-privacy', component: SffoldersPrivacyComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }