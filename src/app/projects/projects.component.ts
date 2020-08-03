import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [ProjectsService],
})
export class ProjectsComponent implements OnInit {
  public data: any = {nodes: [], pagination: 0};
  public response_data_project: any;
  public form_filters: FormGroup;
  public resutls: boolean = false;
  public route = 'filtro-proyectos';
  public stringQuery = '';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public collectionActive: string = '';

  constructor( public Service: ProjectsService, private formBuilder: FormBuilder ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';


  ngOnInit() {
    this.collectionActive = this.route;
    this.createForm();
    $('app-projects').foundation();

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response_data_project = data),
      (err) => console.log(),
      () => {
        if (this.response_data_project) {
          console.log(this.response_data_project.projects_1);
          for (let project of this.response_data_project.projects_1) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(52, this.largo);
              project.url_img = this.dataPath + this.cadena;
            }
          }
          for (let project of this.response_data_project.projects_2) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(52, this.largo);
              project.url_img = this.dataPath + this.cadena;
            }
          }
        }
        /* si responde correctamente */
        if (this.response_data_project.error) {
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
