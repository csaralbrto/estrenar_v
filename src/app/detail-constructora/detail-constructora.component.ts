import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { DetailConstructoraService } from './detail-constructora.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-detail-constructora',
  templateUrl: './detail-constructora.component.html',
  styleUrls: ['./detail-constructora.component.scss'],
  providers: [DetailConstructoraService],
})
export class DetailConstructoraComponent implements OnInit {
  tags: MetaTag;
  public responseSubmit: any;
  public response: any;
  public builder_id: any;
  public responseProject: any;
  public content: any;
  public allProjects: any;
  public results = false;
  public form_filters: FormGroup;
  public form_moreFilters: FormGroup;
  public form: FormGroup;
  public stringQuery = '';
  public filterType: any;
  public filterPrice: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public filterColection: any;
  public filterAreaBuilt: any;
  public filterProjectState: any;
  public filterBuilder: any;
  public filterSort: any;
  public response_data_project: any;
  public countProjects: any;
  public countAllProjects: any;
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
  optionsAreaSelected: string = '';
  optionsCollectionSelected: string = '';
  optionsConstructoraSelected: string = '';
  optionFeatureProyectSelected:string ='';
  optionsSortSelected:string ='';
  public ValoresProyecto: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: DetailConstructoraService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService
    ) {}
    dataPath = environment.endpoint;
    cadena = '';
    largo = '';
    dataConstrutora = '?include=field_builder_logo,field_builder_location.field_location_contact,field_builder_location.field_location';
    url_img_path = 'https://www.estrenarvivienda.com/';
    ngOnInit(): void {
      this.startSpinner();
      this.collectionActive = this.route;
      this.createForm();
      this.createFormMoreFilters();
      this.createForm2();

      const title = this.activatedRoute.snapshot.params.path + this.dataConstrutora;
      this.Service.findConstructora(title).subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            /* si responde correctamente en la respuesta */
            // console.log(this.response);
            // for (let project of this.response.constructora.proyectos) {
            //     if (project.url_img) {
            //         this.largo = project.url_img.length;
            //         this.cadena = project.url_img.substr(39, this.largo);
            //         project.url_img = this.dataPath + this.cadena;
            //       }
            //     }
            this.content = this.response.data;
            this.builder_id = this.content.drupal_internal__id;
            if(this.content.metatag_normalized){
              this.tags = new MetaTag(this.content.metatag_normalized, this.meta);
            }
            /* Método para obtener los proyectos de la constructora */
            let stringBuilders =  this.content.drupal_internal__id + '?items_per_page=24&page=0'
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
                    /* format numbr */
                    project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
                    this.results = true;
                  }
                  /* si responde correctamente */
                }
              }
            );
            /* Método para obtener toda la info de proyectos */
            let url_builder_filters = 'typologies/project_builder/'+this.content.drupal_internal__id+'?items_per_page=8';
            this.Service.getFilters( url_builder_filters ).subscribe(
              (data) => (this.response = data),
              (err) => console.log(),
              () => {
                if (this.response) {
                  console.log(this.response);
                  this.allProjects = this.response.search_results
                  this.countProjects = this.allProjects.length;
                  if(this.response.facets.property_type){
                    this.filterType = this.response.facets.property_type;
                  }
                  if(this.response.facets.project_city){
                    this.filterCity = this.response.facets.project_city;
                  }
                  if(this.response.facets.typology_price){
                    this.filterPrice = this.response.facets.typology_price;
                  }
                  //Área m2
                  if(this.response.facets.area_built){
                    this.filterAreaBuilt = this.response.facets.area_built;
                  }
                  //collection
                  if(this.response.facets.project_collection){
                    this.filterColection = this.response.facets.project_collection;
                  }
                  // estados del proyecto
                  if(this.response.facets.project_feature){
                    let project_feature = this.response.facets.project_feature;
                    for (let feature of project_feature) {
                      if(feature.values.value == "Estado del proyecto"){
                        this.filterProjectState = feature.children;
                        this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                      // console.log(this.ValoresProyecto);

                      }
                    }
                    // console.log(this.filterProjectState);

                  }
                  // Constructora
                  if(this.response.facets.project_builder){
                    this.filterBuilder = this.response.facets.project_builder
                  }
                  /* Ordenación */
                  if(this.response.sorts){
                    this.filterSort = this.response.sorts;
                  }
                  this.results = true;
                }
              }
            );
            this.stopSpinner();
          }
        }
      );
      $('html,body').scrollTop(0);
    }
    ngAfterViewChecked() {
      if (this.results) {
        $('app-detail-constructora').foundation();
        // $('html,body').scrollTop(0);
        if ($('.slider-proyects-mobile').length) {
          $('.slider-proyects-mobile').not('.slick-initialized').slick({
            dots: true,
            autoplay: true,
            autoplaySpeed: 5000,
          });
        }
      }
    }
    decreaseValue(value) {
      if(value == 1){
        var val = $('#bedroom').val();
        if(val > 0){
          val = Number(val)-Number(1);
          $('#bedroom').val(val);
        }
      }else if(value == 2){
        var val = $('#bathroom').val();
        if(val > 0){
          val = Number(val)-Number(1);
          $('#bathroom').val(val);
        }
      }else if(value == 3){
        var val = $('#garage').val();
        if(val > 0){
          val = Number(val)-Number(1);
          $('#garage').val(val);
        }
      }
     }
    incrementValue(value) {
      if(value == 1){
        var val = $('#bedroom').val();
        val = Number(val)+Number(1);
        $('#bedroom').val(val);
      }else if(value == 2){
        var val = $('#bathroom').val();
        val = Number(val)+Number(1);
        $('#bathroom').val(val);
      }else if(value == 3){
        var val = $('#garage').val();
        val = Number(val)+Number(1);
        $('#garage').val(val);
      }
    }
    change(contructoraID,value) {
      this.startSpinner();
      this.stringQuery = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          this.stringQuery = value[key];
        }
      },this);
      /* añadimos el parametro del tipo de busqueda */
      let new_stringQuery = '/project_builder/' + contructoraID + '/';
      this.stringQuery = this.stringQuery.replace('/project_builder/10/','/project_builder/' + contructoraID + '/')
      // console.log(this.stringQuery);
      /* llamamos la funcion que va a buscar */
      this.getDataSearch(this.stringQuery);
    }
    changeMoreFilters(value) {
      this.startSpinner();
      // this.bandera = false;
      this.stringQuery = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          this.stringQuery = value[key];
        }
      },this);
      // console.log(this.stringQuery);
      // this.beforeCheck(this.response.individual);}
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
          this.allProjects = this.response.search_results
          for (let project of this.allProjects) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
          }
          this.countProjects = this.allProjects.length;
          this.countAllProjects = this.response.total;
          /* Iterar sobre Filtros */
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
          if(this.response.facets.project_feature){
            let project_feature = this.response.facets.project_feature;
            for (let feature of project_feature) {
              if(feature.values.value == "Estado del proyecto"){

                this.filterProjectState = feature.children;
                this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                for (let features of this.ValoresProyecto) {
                if(features.values.active == 'true'){
                  this.optionFeatureProyectSelected = features.url;
                }
              }


              }
            }
            // console.log(this.filterProjectState);

          }
          // ÁREA M2
          if(this.response.facets.area_built){
            this.filterAreaBuilt = this.response.facets.area_built
            for (let featureAreaBuilt of this.filterAreaBuilt) {
              if(featureAreaBuilt.values.active == "true")
              {
                this.optionsAreaSelected = featureAreaBuilt.url;
              }


            }
          }
          // Collection
          if(this.response.facets.project_collection){
            this.filterColection = this.response.facets.project_collection
            for (let featureCollection of this.filterColection) {
              if(featureCollection.values.active == "true")
              {
                this.optionsAreaSelected = featureCollection.url;
              }


            }
          }
          // costructora
          if(this.response.facets.project_builder)
              {
                this.filterBuilder = this.response.facets.project_builder
                for (let featureProjectBuilder of this.filterBuilder ) {
                  if(featureProjectBuilder.values.active == "true")
                  {
                    this.optionsConstructoraSelected = featureProjectBuilder.url;
                  }


                }
          }
          if(this.response.sorts){
            this.optionsSectorSelected = '';
            for(let optionSector of this.response.sorts){
              if(optionSector.active == true){
                this.optionsSortSelected = optionSector.url;
              }
            }
            this.filterSort = this.response.sorts;
            this.stopSpinner();
            // console.log("debo de parar");
          }
          this.results = true;
          this.stopSpinner();
        }
      })
      .catch(error => console.error(error))

    }
    clickCollection(url){
      this.startSpinner();
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
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
          }
          this.countProjects = this.allProjects.length;
          this.countAllProjects = this.response.total;
          /* Iterar sobre Filtros */
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
          if(this.response.facets.project_feature){
            let project_feature = this.response.facets.project_feature;
            for (let feature of project_feature) {
              if(feature.values.value == "Estado del proyecto"){

                this.filterProjectState = feature.children;
                this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                for (let features of this.ValoresProyecto) {
                if(features.values.active == 'true'){
                  this.optionFeatureProyectSelected = features.url;
                }
              }


              }
            }
            // console.log(this.filterProjectState);

          }
          // ÁREA M2
          if(this.response.facets.area_built){
            this.filterAreaBuilt = this.response.facets.area_built
            for (let featureAreaBuilt of this.filterAreaBuilt) {
              if(featureAreaBuilt.values.active == "true")
              {
                this.optionsAreaSelected = featureAreaBuilt.url;
              }


            }
          }
          // Collection
          if(this.response.facets.project_collection){
            this.filterColection = this.response.facets.project_collection
            for (let featureCollection of this.filterColection) {
              if(featureCollection.values.active == "true")
              {
                this.optionsAreaSelected = featureCollection.url;
              }


            }
          }
          // costructora
          if(this.response.facets.project_builder)
              {
                this.filterBuilder = this.response.facets.project_builder
                for (let featureProjectBuilder of this.filterBuilder ) {
                  if(featureProjectBuilder.values.active == "true")
                  {
                    this.optionsConstructoraSelected = featureProjectBuilder.url;
                  }


                }
          }
          if(this.response.sorts){
            this.optionsSectorSelected = '';
            for(let optionSector of this.response.sorts){
              if(optionSector.active == true){
                this.optionsSortSelected = optionSector.url;
              }
            }
            this.filterSort = this.response.sorts;
            this.stopSpinner();
            // console.log("debo de parar");
          }
          this.results = true;
          this.stopSpinner();
        }
      })
      .catch(error => console.error(error))

    }
    changeSort() {
      this.startSpinner();
      this.stringQuery = $('#sortBy option:selected').val();
      // console.log(this.stringQuery);
      // this.beforeCheck(this.response.individual);}
      var url = this.stringQuery;
      // console.log(url);
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
          this.allProjects = this.response.search_results
          this.countProjects = this.allProjects.length;
          this.countAllProjects = this.response.total;
          for (let project of this.allProjects) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
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
            // console.log("cambie");
            this.optionsSectorSelected = '';
            for(let optionSector of this.response.facets.project_neighborhood){
              if(optionSector.values.active == 'true'){
                this.optionsSectorSelected = optionSector.url;
              }
            }
            this.filterSector = this.response.facets.project_neighborhood;
          }
          if(this.response.facets.project_feature){
            let project_feature = this.response.facets.project_feature;
            for (let feature of project_feature) {
              if(feature.values.value == "Estado del proyecto"){

                this.filterProjectState = feature.children;
                this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                for (let features of this.ValoresProyecto) {
                if(features.values.active == 'true'){
                  this.optionFeatureProyectSelected = features.url;
                }
              }


              }
            }
            // console.log(this.filterProjectState);
          }
          // ÁREA M2
          if(this.response.facets.area_built){
            this.filterAreaBuilt = this.response.facets.area_built
            for (let featureAreaBuilt of this.filterAreaBuilt) {
              if(featureAreaBuilt.values.active == 'true')
              {
                this.optionsAreaSelected = featureAreaBuilt.url;
              }
            }
          }
          // Collection
          if(this.response.facets.project_collection){
            this.filterColection = this.response.facets.project_collection
            for (let featureCollection of this.filterColection) {
              if(featureCollection.values.active == "true")
              {
                this.optionsAreaSelected = featureCollection.url;
              }


            }
          }
          // costructora
          if(this.response.facets.project_builder)
              {
                this.filterBuilder = this.response.facets.project_builder
                for (let featureProjectBuilder of this.filterBuilder ) {
                  if(featureProjectBuilder.values.active == 'true')
                  {
                    this.optionsConstructoraSelected = featureProjectBuilder.url;
                  }
                }
          }
          /* Ordenación */
          if(this.response.sorts){
            this.optionsSortSelected = '';
            for(let optionSort of this.response.sorts){
              if(optionSort.active == true){
                this.optionsSortSelected = optionSort.url;
              }
            }
            // $('#sortBy option[value=this.optionsSortSelected]').attr('selected','selected');
            this.filterSort = this.response.sorts;
          }
          this.results = true;
          this.stopSpinner();
        }
      })
      .catch(error => console.error(error))

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
          if(this.response.facets.project_feature){
            let project_feature = this.response.facets.project_feature;
            for (let feature of project_feature) {
              if(feature.values.value == "Estado del proyecto"){

                this.filterProjectState = feature.children;
                this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                for (let features of this.ValoresProyecto) {
                if(features.values.active == 'true'){
                  this.optionFeatureProyectSelected = features.url;
                }
              }


              }
            }
            // console.log(this.filterProjectState);

          }
          // ÁREA M2
          if(this.response.facets.area_built){
            this.filterAreaBuilt = this.response.facets.area_built
            for (let featureAreaBuilt of this.filterAreaBuilt) {
              if(featureAreaBuilt.values.active == "true")
              {
                this.optionsAreaSelected = featureAreaBuilt.url;
              }


            }
          }
          // Collection
          if(this.response.facets.project_collection){
            this.filterColection = this.response.facets.project_collection
            for (let featureCollection of this.filterColection) {
              if(featureCollection.values.active == "true")
              {
                this.optionsAreaSelected = featureCollection.url;
              }


            }
          }
          // costructora
          if(this.response.facets.project_builder)
              {
                this.filterBuilder = this.response.facets.project_builder
                for (let featureProjectBuilder of this.filterBuilder ) {
                  if(featureProjectBuilder.values.active == "true")
                  {
                    this.optionsConstructoraSelected = featureProjectBuilder.url;
                  }


                }
          }
          if(this.response.sorts){
            this.optionsSectorSelected = '';
            for(let optionSector of this.response.sorts){
              if(optionSector.active == true){
                this.optionsSortSelected = optionSector.url;
              }
            }
            this.filterSort = this.response.sorts;
            this.stopSpinner();
            // console.log("debo de parar");
          }
          this.results = true;
          this.stopSpinner();
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
    createFormMoreFilters() {
      this.form_moreFilters =  this.formBuilder.group({
        project_state: new FormControl(),
        builder: new FormControl('Seleccione'),
        arear_build: new FormControl('Seleccione'),
        constructora_builder: new FormControl('Seleccione'),
        collections: new FormControl(),
        // zone: new FormControl('Seleccione'),
        // sector: new FormControl('Seleccione'),
      });
    }
    createForm2() {
      this.form =  this.formBuilder.group({
        name: new FormControl(''),
        lastname: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        contact: new FormControl('Deseas ser contactado'),
        typeSearch: new FormControl(''),
        term: new FormControl(''),
      });
    }
    cleanFilter(){
      location.reload();
    }
    onSubmit(values) {
      console.log(values);
      var error = false;
      if(values.name == null || values.name == ""){
        $('#spanName').removeClass('hide');
        error = true;
      }else{
        $('#spanName').addClass('hide');
        error = false;
      }
      if(values.lastname == null || values.lastname == ""){
        $('#spannLastName').removeClass('hide');
        error = true;
      }else{
        $('#spannLastName').addClass('hide');
        error = false;
      }
      if(values.phone == null || values.phone == ""){
        $('#spanPhone').removeClass('hide');
        error = true;
      }else{
        $('#spanPhone').addClass('hide');
        error = false;
      }
      if(values.email == null || values.email == ""){
        $('#spanEmail').removeClass('hide');
        error = true;
      }else{
        $('#spanEmail').addClass('hide');
        error = false;
      }
      if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
        $('#spanContact').removeClass('hide');
        error = true;
      }else{
        $('#spanContact').addClass('hide');
        error = false;
      }
      if(values.typeSearch == null || values.typeSearch == ""){
        $('#spanTypesearch').removeClass('hide');
        error = true;
      }else{
        $('#spanTypesearch').addClass('hide');
        error = false;
      }
      if(values.term == null || values.term == ""){
        $('#spanTerm').removeClass('hide');
        error = true;
      }else{
        $('#spanTerm').addClass('hide');
        error = false;
      }
      if(!error){
        /* Se recibe los valores del formulario */
        var f = new Date();
        var date = f.getFullYear()+ "-" + (f.getMonth() +1) + "-" + f.getDate() + "T" + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
        values.type_submit = 'contact_form';
        var url = window.location.pathname;
        let payload = {
            "identity": {
              "mail": values.email,
              "phone": values.phone
          },
          "personal": {
              "name": values.name,
              "lastName": values.lastname
          },
          "campaign": {
              "options": [
                  {
                      "UTM source": sessionStorage['UTMSource']?sessionStorage.getItem("UTMSource"):""
                  },
                  {
                      "UTM medium": sessionStorage['UTMMedium']?sessionStorage.getItem("UTMMedium"):""
                  },
                  {
                      "UTM content": sessionStorage['UTMContent']?sessionStorage.getItem("UTMContent"):""
                  },
                  {
                      "UTM campaign": sessionStorage['UTMCampaing']?sessionStorage.getItem("UTMCampaing"):""
                  }
              ]
          },
          "additional": {
              "comment": values.comment,
              "emailCopy": values.emailCopy
          },
          "contextual": {
              "options": [
                  {
                      "Ruta": url
                  },
                  {
                      "Dispositivo": "Escritorio"
                  }
              ]
          },
          "profiling": {
              "survey":
              [
                  {
                      "Deseas ser contactado vía": values.contact
                  }
              ],
              "location": values.city
          },
          "main": {
              "privacyNotice": 5323,
              "category": "Contáctenos"
          }
      }
      // console.log(payload);
        this.Service.getFormService( payload )
        .subscribe(
          data =>(this.responseSubmit = data),
          err => console.log(),
          () => {
            if(this.responseSubmit.id){
              $('#exampleModal1').foundation('open');
              this.form.reset();
            }
            if(!this.responseSubmit.id){
              // $('#modalAlertError').foundation('open');
            }
          }
        );
      }
    }
    /* Métodos de loading */
    startSpinner(): void {
      if (this.spinnerService) {
        this.spinnerService.show();
      }
    }
     stopSpinner(): void {

      if (this.spinnerService) {
        // console.log("ingrese a parar");
        this.spinnerService.hide();
      }
    }
    /* Fin de métodos de loading */
}
