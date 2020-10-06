import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { DetailConstructoraService } from './detail-constructora.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-detail-constructora',
  templateUrl: './detail-constructora.component.html',
  styleUrls: ['./detail-constructora.component.scss'],
  providers: [DetailConstructoraService],
})
export class DetailConstructoraComponent implements OnInit {
  public response: any;
  public responseProject: any;
  public content: any;
  public allProjects: any;
  public results = false;
  public form_filters: FormGroup;
  public stringQuery = '';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public data: any = {nodes: [], pagination: 0};
  public collectionActive: string = '';
  public route = 'filtro-proyectos';


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: DetailConstructoraService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    ) {}
    dataPath = environment.endpoint;
    cadena = '';
    largo = '';
    dataConstrutora = '?include=field_builder_logo,field_builder_location.field_location_contact,field_builder_location.field_location';
    url_img_path = 'https://www.estrenarvivienda.com/';
  ngOnInit(): void {
    this.collectionActive = this.route;
    this.createForm();
    // $(document).foundation();

    const title = this.activatedRoute.snapshot.params.path + this.dataConstrutora;
    this.Service.findConstructora(title).subscribe(
      (data) => (this.response = data.data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente en la respuesta */
          console.log(this.response);
          // for (let project of this.response.constructora.proyectos) {
          //     if (project.url_img) {
          //         this.largo = project.url_img.length;
          //         this.cadena = project.url_img.substr(39, this.largo);
          //         project.url_img = this.dataPath + this.cadena;
          //       }
          //     }
          this.content = this.response;
        }
      }
    );
    /* Método para obtener los proyectos de la constructora */
    this.Service.constructoraProjects().subscribe(
      (data) => (this.responseProject = data),
      (err) => console.log(),
      () => {
        if (this.responseProject) {
          this.allProjects = this.responseProject.search_results;
          for (let project of this.allProjects) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            this.results = true;
          }
          /* si responde correctamente */
        }
      }
    );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-detail-constructora').foundation();
    }
  }

  change(contructoraID,value) {
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
      this.stringQuery = 'find=projects&constructora='+contructoraID;
      /* recorremos el array para saber con que parametos se va a buscar */
      term.forEach(element => {
        this.stringQuery = this.stringQuery + '&' + element;

      });
      console.log(this.stringQuery);
      /* llamamos la funcion que va a buscar */
      this.getDataSearch();
  }
  getDataSearch(){
    // this.Service.getDataFilter(this.stringQuery)
    //   .subscribe(
    //     data => { },
    //     err => console.log(),
    //     () => {}
    //   );
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
