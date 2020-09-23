import { Component, OnInit } from '@angular/core';
import { ConstructoraService } from './constructora.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-constructora',
  templateUrl: './constructora.component.html',
  styleUrls: ['./constructora.component.scss'],
  providers: [ConstructoraService],
})
export class ConstructoraComponent implements OnInit {
  public response: any;

  constructor( public Service: ConstructoraService ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';

  ngOnInit(): void {
    $('app-constructora').foundation();
    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response.projects_1);
          for (let project of this.response) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(35, this.largo);
              // this.cadena = project.url_img.substr(52, this.largo);
              project.url_img = this.dataPath + this.cadena;
            }
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
