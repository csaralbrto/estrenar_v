import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgmCoreModule } from '@agm/core';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { Ng5SliderModule } from 'ng5-slider';

// import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { ConstructoraComponent } from './constructora/constructora.component';
import { ProjectsComponent } from './projects/projects.component';
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
import { SocialComponent } from './social/social.component';
import { HttpModule } from '@angular/http';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ContactusComponent } from './contactus/contactus.component';
import { DetailConstructoraComponent } from './detail-constructora/detail-constructora.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { TypologyComponent } from './typology/typology.component';
import { LoginComponent } from './login/login.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { GlosoryComponent } from './glosory/glosory.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { DataTreatmentsComponent } from './data-treatments/data-treatments.component';
import { RevistaDigitalComponent } from './revista-digital/revista-digital.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectPreviewComponent } from './project-preview/project-preview.component';
import { StreetViewComponent } from './street-view/street-view.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    ConstructoraComponent,
    ProjectsComponent,
    ToolComponent,
    ComparatorComponent,
    ContentUploadComponent,
    WizardComponent,
    LayaoutComponent,
    UserComponent,
    FooterComponent,
    HeaderComponent,
    SideBarComponent,
    BreadcrumbsComponent,
    SocialComponent,
    ProjectDetailComponent,
    ContactusComponent,
    DetailConstructoraComponent,
    FavoritesComponent,
    BlogDetailComponent,
    TypologyComponent,
    LoginComponent,
    PostLoginComponent,
    MyAccountComponent,
    ContactUsComponent,
    QuienesSomosComponent,
    GlosoryComponent,
    PrivacyNoticeComponent,
    LegalNoticeComponent,
    DataTreatmentsComponent,
    RevistaDigitalComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProjectPreviewComponent,
    StreetViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    /* autocomplete */
    AutocompleteLibModule,
    /* Slider Range */
    Ng5SliderModule,
    /* Recaptcha */
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    /* Google Maps */
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpDGfOlZAtjd1PV0UOk9a-BZ7LfHvcFFM',
      libraries: ['places']
    }),
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    // MatFormFieldModule,
    MatNativeDateModule


  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
