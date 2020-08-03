import { Component, OnInit } from '@angular/core';
import { ToolService } from './tool.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  providers: [ToolService],
})
export class ToolComponent implements OnInit {
  public response: any;
  constructor( public Service: ToolService ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  projects = [];
  index = 0;

  ngOnInit(): void {
    $(document).foundation();
    $('app-projects').foundation();

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          // console.log(this.response.projects_1);
          for (let project of this.response.project) {
            this.index = this.index +1;
            if (project.url_img && this.index < 5) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(52, this.largo);
              project.url_img = this.dataPath + this.cadena;
              this.projects.push(project) 
            }
            console.log(this.projects);
          }
          for (let blog of this.response.blogs) {
            this.largo = blog.banner.length;
            this.cadena = blog.banner.substr(52, this.largo);
            blog.banner = this.dataPath + this.cadena;
          }
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
      );
  }
}
