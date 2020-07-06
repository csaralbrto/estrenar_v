import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeLayoutsComponent } from './home-layouts/home-layouts.component';
import { BlogComponent } from './blog/blog.component';
import { ConstructoraComponent } from './constructora/constructora.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeLayoutsComponent,
    BlogComponent,
    ConstructoraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
