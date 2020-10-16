import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ComparatorService } from './comparator.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss'],
  providers: [ ComparatorService ]
})
export class ComparatorComponent implements OnInit {
  public response: any;
  public response_data_project: any;
  public classRow: any;
  public stylesText: any;

  constructor( public Service: ComparatorService, private router: Router, ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {

    /* Método para obtener toda la info del comparador */

    var stringQuery = "";
    if (sessionStorage['id']) {
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      for (let ids of storedIds) {
        stringQuery = stringQuery+ids+"+";
      }
      stringQuery = stringQuery.substring(0, stringQuery.length - 1);
      // console.log(stringQuery);
      this.Service.comparatorData(stringQuery)
      .subscribe(
        data => this.response = data,
        err => console.log(),
        () => {
          if(this.response){
            console.log(this.response);
            /* si responde correctamente */
            this.response_data_project = this.response.search_results
            var count_results = this.response_data_project.length;
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
            }
            console.log(count_results);
            if(count_results == 1){
              this.classRow = "medium-3";
              this.stylesText = "margin-top: -24px;";
            }else if(count_results == 2){
              this.classRow = "medium-6";
              this.stylesText = "margin-top: 101px";
            }else if(count_results == 3){
              this.classRow = "medium-4";
              this.stylesText = "margin-top: 36px;";
            }else if(count_results == 4){
              this.classRow = "medium-3";
            }
          }
          if(this.response.error){
            /* si hay error en la respuesta */
          }
        }
      );    
    }
  }
  removeCompare(value) {
    console.log('entro',value);
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      /* remover el proyecto de los coparadores */
      const index = storedIds.indexOf(value);
      storedIds.splice(index, 1);
      /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
      sessionStorage.setItem('id',JSON.stringify(storedIds))
     // this.router.navigate(['comparador']);
      console.log('este es el id: ',storedIds);
      if(storedIds.length > 0){
        window.location.reload();
      }else{
        this.router.navigate(['home']);
      }
  }

}
