import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectPreviewComponent } from './project-preview/project-preview.component';
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
    data: {url: true, alwaysRefresh: true},
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
    ,data: {url: true, alwaysRefresh: true},
  },

  {
    path: 'proyectos', component: ProjectsComponent,
    pathMatch: 'full' ,
    data: { alwaysRefresh: true },
  },
  {
    path: 'vivienda-interes-social', component: ProjectsComponent,
    pathMatch: 'full' ,
    data: { alwaysRefresh: true },
  },
  {
    path: 'proyectos-vacacionales', component: ProjectsComponent,
    pathMatch: 'full' ,
    data: { alwaysRefresh: true },
  },

  {
    path: 'proyecto/node/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'proyecto/:path/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: ':path/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: ':node/:path',
    component: ProjectDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'es/preview-project',
    component: ProjectPreviewComponent,
    pathMatch: 'full',
  },
  { path: 'herramientas', component: ToolComponent, pathMatch: 'full' },
  {
    path: 'constructoras',
    component: ConstructoraComponent,
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
    path: 'articulos/:path/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'articulos/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'articulos/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'noticias-del-sector/:path/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'noticias-del-sector/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'la-experiencia-de-estrenar/:path/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'la-experiencia-de-estrenar/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'articulos/nuestro-lado-deco/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  {
    path: 'nuestro-lado-deco/:path',
    component: BlogDetailComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
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
  {
    path: ':path',
    component: DetailConstructoraComponent,
    pathMatch: 'full',
    data: { alwaysRefresh: true },
  },
  { path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
