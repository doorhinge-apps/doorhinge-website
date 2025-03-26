import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { OurAppsComponent } from './our-apps/our-apps.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GradientLinesComponent } from './Animations/gradient-lines/gradient-lines.component';
import { CirclesGradientComponent } from './Animations/circles-gradient/circles-gradient.component';
import { SpacerComponent } from './spacer/spacer.component';
import { ScrollingAppsComponent } from './Animations/scrolling-apps/scrolling-apps.component';
import { ScrollingAppsContainerComponent } from './Animations/scrolling-apps-container/scrolling-apps-container.component';
import { SffoldersPrivacyComponent } from './Privacy Info/sffolders-privacy/sffolders-privacy.component';
import { DropdownModule } from '@coreui/angular';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyComponent } from './privacy/privacy.component';

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
    SpacerComponent,
    ScrollingAppsComponent,
    ScrollingAppsContainerComponent,
    SffoldersPrivacyComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  exports: [SpacerComponent]
})
export class AppModule { }
