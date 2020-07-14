import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeLayoutsComponent } from './home-layouts/home-layouts.component';
import { BlogComponent } from './blog/blog.component';
import { ConstructoraComponent } from './constructora/constructora.component';
import { ToolComponent } from './tool/tool.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { WizardComponent } from './wizard/wizard.component';
import { LayaoutComponent } from './layaout/layaout.component';
import { UserComponent } from './user/user.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeLayoutsComponent,
    BlogComponent,
    ConstructoraComponent,
    ToolComponent,
    ComparatorComponent,
    ContentUploadComponent,
    WizardComponent,
    LayaoutComponent,
    UserComponent,
    FooterComponent,
    HeaderComponent,
    SideBarComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
