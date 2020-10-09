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
  optionsLocationSelected: string = '';
  public stringQuery: any;
  public filterLocation: any;

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
          }
          if(this.response.facets.builder_location_city){
            this.filterLocation = this.response.facets.builder_location_city;
          }
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }

  change(value) {
    this.stringQuery = $("#location").val();
    console.log(this.stringQuery)
    // this.beforeCheck(this.response.individual);
    var url = this.stringQuery;
    var data = "";
    fetch(url, {
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
      // console.log(this.response);
      if (this.response) { 
        // console.log(this.response.search_results);
        this.constructoras = this.response.search_results;
        for (let project of this.constructoras) {
          var arrayDeCadenas = project.builder_location_phone.split(',');
          project.builder_location_phone = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.builder_address.split(',');
          project.builder_address = arrayDeCadenas2[0];
        }
        if(this.response.facets.builder_location_city){
          // console.log(this.response.facets.builder_location_city);
            this.optionsLocationSelected = '';
            for(let optionType of this.response.facets.builder_location_city){
              if(optionType.values.active == 'true'){
                this.optionsLocationSelected = optionType.url;
              }
            }
            this.filterLocation = this.response.facets.builder_location_city;
          }
        
        // this.results = true;
      }
    })
    .catch(error => console.error(error))
    
  }
}
