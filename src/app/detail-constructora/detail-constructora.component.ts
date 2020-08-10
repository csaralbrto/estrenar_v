import { Component, OnInit } from '@angular/core';
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
  public content: any;
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
  ngOnInit(): void {
    this.collectionActive = this.route;
    this.createForm();
    $(document).foundation();

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findConstructora(title).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          this.content = this.response.constructora;
          /* si responde correctamente en la respuesta */
          // console.log(this.response);
          // this.largo = this.response.url_img.length;
          // this.cadena = this.response.url_img.substr(40, this.largo);
          // this.response.url_img = this.dataPath + this.cadena;
          // for (let project of this.response.relacionados) {
          //   if (project.url_img) {
          //     this.largo = project.url_img.length;
          //     this.cadena = project.url_img.substr(40, this.largo);
          //     project.url_img = this.dataPath + this.cadena;
          //   }
          // }
        }
      }
    );
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
