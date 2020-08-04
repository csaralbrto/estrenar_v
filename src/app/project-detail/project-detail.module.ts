import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectDetailComponent } from './project-detail.component';



@NgModule({
  declarations: [ProjectDetailComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule 
  ]
})
export class ProjectDetailModule { }
