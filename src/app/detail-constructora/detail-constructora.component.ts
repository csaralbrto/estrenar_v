import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { DetailConstructoraService } from './detail-constructora.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
declare var $: any;

@Component({
  selector: 'app-detail-constructora',
  templateUrl: './detail-constructora.component.html',
  styleUrls: ['./detail-constructora.component.scss'],
  providers: [DetailConstructoraService],
})
export class DetailConstructoraComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public responseProject: any;
  public content: any;
  public allProjects: any;
  public results = false;
  public form_filters: FormGroup;
  public stringQuery = '';
  public filterType: any;
  public filterPrice: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public response_data_project: any;
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public data: any = {nodes: [], pagination: 0};
  public collectionActive: string = '';
  public route = 'filtro-proyectos';
  optionsTypySelected: string = '';
  optionsPriceSelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: DetailConstructoraService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    ) {}
    dataPath = environment.endpoint;
    cadena = '';
    largo = '';
    dataConstrutora = '?include=field_builder_logo,field_builder_location.field_location_contact,field_builder_location.field_location';
    url_img_path = 'https://www.estrenarvivienda.com/';
    ngOnInit(): void {
      this.collectionActive = this.route;
      this.createForm();

      const title = this.activatedRoute.snapshot.params.path + this.dataConstrutora;
      this.Service.findConstructora(title).subscribe(
        (data) => (this.response = data),
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
            this.content = this.response.data;
            if(this.content.metatag_normalized){
              this.tags = new MetaTag(this.content.metatag_normalized, this.meta);
            }
            /* Método para obtener los proyectos de la constructora */
            let stringBuilders =  this.content.drupal_internal__id + '?items_per_page=12&page=0'
            this.Service.constructoraProjects(stringBuilders).subscribe(
              (data) => (this.responseProject = data),
              (err) => console.log(err),
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
        }
      );
      /* Método para obtener toda la info de proyectos */
      this.Service.getFilters().subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            if(this.response.facets.property_type){
              this.filterType = this.response.facets.property_type;
            }
            if(this.response.facets.project_city){
              this.filterCity = this.response.facets.project_city;
            }
            if(this.response.facets.typology_price){
              this.filterPrice = this.response.facets.typology_price;
            }
            this.results = true;
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
      this.stringQuery = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          this.stringQuery = value[key];
        }
      },this);
      /* añadimos el parametro del tipo de busqueda */
      let new_stringQuery = '/project_builder/' + contructoraID + '/';
      this.stringQuery = this.stringQuery.replace('/project_builder/10/','/project_builder/' + contructoraID + '/')
      console.log(this.stringQuery);
        /* recorremos el array para saber con que parametos se va a buscar */
        // term.forEach(element => {
        //   this.stringQuery = this.stringQuery + '&' + element;

        // });
        // console.log(this.stringQuery);
        /* llamamos la funcion que va a buscar */
        this.getDataSearch(this.stringQuery);
    }
    getDataSearch(url){
      fetch(url, {
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        this.response = data;
        // console.log(this.response);
        if (this.response) { 
          // console.log(this.response.search_results);
          this.allProjects = this.response.search_results
          for (let project of this.allProjects) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
          }
          if(this.response.facets.property_type){
            this.optionsTypySelected = '';
            for(let optionType of this.response.facets.property_type){
              if(optionType.values.active == 'true'){
                this.optionsTypySelected = optionType.url;
              }
            }
            this.filterType = this.response.facets.property_type;
          }
          if(this.response.facets.project_city){
            this.optionsCitySelected = '';
            for(let optionCity of this.response.facets.project_city){
              if(optionCity.values.active == 'true'){
                this.optionsCitySelected = optionCity.url;
              }
            }
            this.filterCity = this.response.facets.project_city;
          }
          if(this.response.facets.typology_price){
            this.optionsPriceSelected = '';
            for(let optionPrice of this.response.facets.typology_price){
              if(optionPrice.values.active == 'true'){
                this.optionsPriceSelected = optionPrice.url;
              }
            }
            this.filterPrice = this.response.facets.typology_price;
          }
          if(this.response.facets.project_zone){
            this.optionsZoneSelected = '';
            for(let optionZone of this.response.facets.project_zone){
              if(optionZone.values.active == 'true'){
                this.optionsZoneSelected = optionZone.url;
              }
            }
            this.filterZone = this.response.facets.project_zone;
          }
          if(this.response.facets.project_neighborhood){
            this.optionsSectorSelected = '';
            for(let optionSector of this.response.facets.project_neighborhood){
              if(optionSector.values.active == 'true'){
                this.optionsSectorSelected = optionSector.url;
              }
            }
            this.filterSector = this.response.facets.project_neighborhood;
          }
          this.results = true;
        }
      })
      .catch(error => console.error(error))
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
