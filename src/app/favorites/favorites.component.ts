import { Component, OnInit } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  providers: [FavoritesService],
})
export class FavoritesComponent implements OnInit {
  public data: any = {nodes: [], pagination: 0};
  public response: any;
  public form_filters: FormGroup;
  public resutls: boolean = false;
  public route = 'filtro-proyectos';
  public stringQuery = '';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public collectionActive: string = '';

  constructor( public Service: FavoritesService, private formBuilder: FormBuilder ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';

  ngOnInit(): void {
    this.collectionActive = this.route;
    this.createForm();
    $(document).foundation();

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          for (let project of this.response) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(53, this.largo);
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

  change(value) {
    this.data.nodes = [];
    let term = [], field = [], str = [],fields = "";
    this.query_elasticsearch[this.collectionActive].page = 0;

      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          let p = key;
          term.push(p+'='+value[key])
          field.push(p);
        }
      },this);

      /* añadimos el parametro del tipo de busqueda */
      this.stringQuery = 'find=projects';
      /* recorremos el array para saber con que parametos se va a buscar */
      term.forEach(element => {
        this.stringQuery = this.stringQuery + '&' + element;

      });
      /* llamamos la funcion que va a buscar */
      this.getDataSearch();
  }

  getDataSearch(){
    this.Service.getDataFilter(this.stringQuery)
      .subscribe(
        data => { },
        err => console.log(),
        () => {}
      );
  }

  createForm() {
    this.form_filters =  this.formBuilder.group({
      type: new FormControl('Seleccione'),
      price: new FormControl('Seleccione'),
      city: new FormControl('Seleccione'),
      zone: new FormControl('Seleccione'),
      sector: new FormControl('Seleccione'),
    });
  }
}
