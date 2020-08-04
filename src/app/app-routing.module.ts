import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ToolComponent } from './tool/tool.component';
import { ConstructoraComponent } from './constructora/constructora.component';
import { DetailConstructoraComponent } from './detail-constructora/detail-constructora.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'proyectos', component: ProjectsComponent, pathMatch: 'full' },
  {
    path: 'proyecto/:path',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
