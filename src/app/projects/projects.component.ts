import { Component, OnInit, AfterViewChecked } from '@angular/core';
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
export class ProjectsComponent implements OnInit, AfterViewChecked {
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
  public results = false;

  constructor( public Service: ProjectsService, private formBuilder: FormBuilder ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';


  ngOnInit() {
    this.collectionActive = this.route;
    this.createForm();

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response_data_project = data.search_results),
      (err) => console.log(),
      () => {
        if (this.response_data_project) {
          console.log(this.response_data_project);
          for (let project of this.response_data_project) {
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
  ngAfterViewChecked() {
    if (this.results) {
      $('app-projects').foundation();
      // $('html,body').scrollTop(0);
    }
  }

}
