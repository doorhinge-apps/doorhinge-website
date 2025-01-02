import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { OurAppsComponent } from './our-apps/our-apps.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GradientLinesComponent } from './gradient-lines/gradient-lines.component';
import { CirclesGradientComponent } from './circles-gradient/circles-gradient.component';
import { SpacerComponent } from './spacer/spacer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    AboutComponent,
    OurAppsComponent,
    GradientLinesComponent,
    CirclesGradientComponent,
    SpacerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  exports: [SpacerComponent]
})
export class AppModule { }
