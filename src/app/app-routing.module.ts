import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GradientLinesComponent } from './Animations/gradient-lines/gradient-lines.component';
import { CirclesGradientComponent } from './Animations/circles-gradient/circles-gradient.component';
import { ScrollingAppsComponent } from './Animations/scrolling-apps/scrolling-apps.component';
import { ScrollingAppsContainerComponent } from './Animations/scrolling-apps-container/scrolling-apps-container.component';
import { SffoldersPrivacyComponent } from './Privacy Info/sffolders-privacy/sffolders-privacy.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'animation', component: ScrollingAppsContainerComponent },
  { path: 'sf-folders-privacy', component: SffoldersPrivacyComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }