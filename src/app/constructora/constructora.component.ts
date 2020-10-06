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
  public constructoras: any;
  url_img_path = 'https://www.estrenarvivienda.com/';

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
          console.log(this.response);
          this.constructoras = this.response.search_results;
          for (let project of this.constructoras) {
            var arrayDeCadenas = project.builder_location_phone.split(',');
            project.builder_location_phone = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.builder_address.split(',');
            project.builder_address = arrayDeCadenas2[0];
            // if (project.url_img) {
            //   this.largo = project.url_img.length;
            //   this.cadena = project.url_img.substr(35, this.largo);
            //   // this.cadena = project.url_img.substr(52, this.largo);
            //   project.url_img = this.dataPath + this.cadena;
            // }
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
