import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ToolService } from './tool.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  providers: [ToolService],
})
export class ToolComponent implements OnInit, AfterViewChecked {
  public response: any;
  public responseMostRead: any;
  constructor( public Service: ToolService ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  projects = [];
  index = 0;
  public results = false;
  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          for (let project of this.response) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            // if (project.url_img) {
            //   this.largo = project.url_img.length;
            //   this.cadena = project.url_img.substr(31, this.largo);
            //   project.url_img = this.dataPath + this.cadena;
            // }
          }
          this.results = true;
          // console.log(this.response.projects_1);
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
      );
      /* Método para obtener toda la info de los más leidos */
      this.Service.getDataArticle().subscribe(
        (data) => (this.responseMostRead = data),
        (err) => console.log(),
        () => {
          if (this.responseMostRead) {
            console.log(this.responseMostRead);
            /* si responde correctamente */
          }
          if (this.responseMostRead.error) {
            /* si hay error en la respuesta */
          }
        }
      );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-tool').foundation();
    }
  }
}
