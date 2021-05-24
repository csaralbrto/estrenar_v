import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ToolComponent } from './tool/tool.component';
import { ConstructoraComponent } from './constructora/constructora.component';
import { DetailConstructoraComponent } from './detail-constructora/detail-constructora.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { ContactusComponent } from './contactus/contactus.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { RevistaDigitalComponent } from './revista-digital/revista-digital.component';
import { GlosoryComponent } from './glosory/glosory.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { DataTreatmentsComponent } from './data-treatments/data-treatments.component';
import { WizardComponent } from './wizard/wizard.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: {url: true},
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    pathMatch: 'full'
    ,data: {url: true}, 
  },

  { path: 'proyectos', component: ProjectsComponent, pathMatch: 'full' },
  { path: 'vis', component: ProjectsComponent, pathMatch: 'full' },
  { path: 'vacacionales', component: ProjectsComponent, pathMatch: 'full' },

  {
    path: 'es/node/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
  },

  {
    path: 'es/:path/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
  },
  { path: 'herramientas', component: ToolComponent, pathMatch: 'full' },
  {
    path: 'constructoras',
    component: ConstructoraComponent,
    pathMatch: 'full',
  },
  {
    path: 'constructora/:path',
    component: DetailConstructoraComponent,
    pathMatch: 'full',
  },
  {
    path: 'cargar',
    component: ContentUploadComponent,
    pathMatch: 'full',
  },
  {
    path: 'comparador',
    component: ComparatorComponent,
    pathMatch: 'full',
  },
  {
    path: 'favoritos',
    component: FavoritesComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog',
    component: BlogComponent,
    pathMatch: 'full',
  },
  {
    path: 'es/articulos/:path/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
  },
  {
    path: 'es/articulos/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
  },
  {
    path: 'es/noticias-del-sector/:path/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
  },
  {
    path: 'es/noticias-del-sector/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
  },
  {
    path: 'user',
    component: UserComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard] 
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'olvide-contrasena',
    component: ForgotPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'login-post',
    component: PostLoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'contactenos',
    component: ContactusComponent,
    pathMatch: 'full',
  },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent,
    pathMatch: 'full',
  },
  {
    path: 'revista-digital',
    component: RevistaDigitalComponent,
    pathMatch: 'full',
  },
  {
    path: 'glosario',
    component: GlosoryComponent,
    pathMatch: 'full',
  },
  {
    path: 'aviso-privacidad',
    component: PrivacyNoticeComponent,
    pathMatch: 'full',
  },
  {
    path: 'aviso-legal',
    component: LegalNoticeComponent,
    pathMatch: 'full',
  },
  {
    path: 'politica-datos',
    component: DataTreatmentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'wizard',
    component: WizardComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
