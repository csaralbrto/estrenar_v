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
  public responseFirst: any;
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
  public filterBathrooms: any;
  public filterBedrooms: any;
  public filterGarages: any;
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
  optionsBathroomsSelected: string = '';
  optionsBedroomsSelected: string = '';
  optionsGaragesSelected: string = '';
  public ValoresProyecto: any;
  public eventos : boolean = false;
  public mapTypeId: any;
  public builderUuid: any;
  public icon_ev = './assets/images/markets/pin-verde.svg';

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
    latitude: number;
    longitude: number;
    zoom:number;
    contProyecto:number = 4;
    banderaProyecto  = false;
    public resultProyecto:any;


    ngOnInit(): void {
      this.startSpinner();
      this.collectionActive = this.route;
      this.createForm();
      this.createFormMoreFilters();
      this.createForm2();
      $(window).scrollTop(0);
      $('#responsive-nav-social').css('display','none');
      // this.setCurrentLocation();
      // const title = this.activatedRoute.snapshot.params.path + this.dataConstrutora;
      const title = this.activatedRoute.snapshot.params.path;
      console.log(title);
      if(title.indexOf('constructora-') > 1){
        this.Service.findConstructoraUrl(title).subscribe(
          (data) => (this.responseFirst = data),
          (err) => console.log(),
          () => {
            if (this.responseFirst) {
              let url = this.responseFirst.jsonapi.individual + this.dataConstrutora
              this.Service.findConstructora( url ).subscribe(
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
                    let stringBuilders =  this.content.drupal_internal__id + '?items_per_page=24'
                    this.Service.constructoraProjects(stringBuilders).subscribe(
                      (data) => (this.responseProject = data),
                      (err) => console.log(err),
                      () => {
                        if (this.responseProject) {
                          console.log(this.responseProject);
                          this.countAllProjects = this.responseProject.total;
                          this.allProjects = this.responseProject.search_results;
                          this.countProjects = this.allProjects.length;
                          if(this.countProjects == this.countAllProjects){
                            this.banderaProyecto = true;
                          }
                          for (let project of this.allProjects) {
                            var arrayDeCadenas = project.typology_images.split(',');
                            project.typology_images = arrayDeCadenas[0];
                            // if(project.project_category.includes(',')){
                              var arrayDeCadenas2 = project.project_category.split(',');
                              project.project_category = arrayDeCadenas2;
                            // }else{
                            //   project.project_category = project.project_category + ','
                            //   // console.log(project.project_category);
                            //   var arrayDeCadenas2 = project.project_category.split(',');
                            //   project.project_category = arrayDeCadenas2;
                            //   // console.log(typeof project.project_category);
                            // }
                            /* format numbr */
                            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
                            // Nueva linea Yenifer
                            var arrayDeLaton = project.latlon.split(',');
                            project.latitude = arrayDeLaton[0]
                            project.longitude = arrayDeLaton[1]
                            this.results = true;
                          }
                          this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
                          /* si responde correctamente */

                          if(this.responseProject.facets.property_type){
                            this.filterType = this.responseProject.facets.property_type;
                          }
                          if(this.responseProject.facets.project_city){
                            this.filterCity = this.responseProject.facets.project_city;
                          }
                          if(this.responseProject.facets.typology_price){
                            this.filterPrice = this.responseProject.facets.typology_price;
                          }
                          //Área m²
                          if(this.responseProject.facets.area_built){
                            this.filterAreaBuilt = this.responseProject.facets.area_built;
                          }
                          //collection
                          if(this.responseProject.facets.project_collection){
                            this.filterColection = this.responseProject.facets.project_collection;
                          }
                          // estados del proyecto
                          if(this.responseProject.facets.project_feature){
                            let project_feature = this.responseProject.facets.project_feature;
                            for (let feature of project_feature) {
                              if(feature.values.value == "Estado del proyecto"){
                                this.filterProjectState = feature.children;
                                this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                              }
                            }
                          }
                          // Constructora
                          if(this.responseProject.facets.project_builder){
                            this.filterBuilder = this.responseProject.facets.project_builder
                          }
                          /* Ordenación */
                          if(this.responseProject.sorts){
                            this.filterSort = this.responseProject.sorts;
                          }
                          /* Baños */
                          if(this.responseProject.facets.bathrooms){
                            this.filterBathrooms = this.responseProject.facets.bathrooms;
                          }
                          /* Habitaciones */
                          if(this.responseProject.facets.bedrooms){
                            this.filterBedrooms = this.responseProject.facets.bedrooms;
                          }
                          /* Garajes */
                          if(this.responseProject.facets.garages){
                            this.filterGarages = this.responseProject.facets.garages;
                          }
                          this.results = true;
                        }
                      }
                    );
                  }
                }
              );
              this.stopSpinner();
            }
          }
        );
        $('html,body').scrollTop(0);
      }else{
        this.router.navigate(['no-encontrada']);
      }
    }
    /* Obtener la locacion en coordenadas actual */
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 5;
          this.mapTypeId = 'hybrid';
        });
      }
    }
    /* Obtener la locacion en coordenadas del primer proyecto */
    public setLocationProject(lat,long) {
      this.latitude = Number(lat);
      this.longitude = Number(long);
      this.zoom = 9;
      this.mapTypeId = 'hybrid';
    }
    // Ocultar mapa
    showMap(event){
      if(event == false){
        // console.log("here");
        $('#ProyectMap').addClass('hide');
        $( "#smallScrenn" ).removeClass( 'medium-6 columns' );
        $( "#smallScrenn" ).addClass( 'medium-12 columns' );
        $( ".FullScrenn" ).removeClass( 'medium-6 columns end' );
        $( ".FullScrenn" ).addClass( 'medium-3 columns end' );
        // $('#cbox1').attr('checked', false);
        this.eventos = false;
      }else{
        this.eventos = event.target.checked;
        console.log(event.target.checked);
        if(this.eventos  == true){
          $('#ProyectMap').toggleClass('hide');
          $( "#smallScrenn" ).removeClass( 'medium-12 columns' );
          $( "#smallScrenn" ).addClass( 'medium-6 columns' );
          $( ".FullScrenn" ).removeClass( 'medium-3 columns end' );
          $( ".FullScrenn" ).addClass( 'medium-6 columns end' );
        }else{
          // console.log("here");
          $('#ProyectMap').toggleClass('hide');
          $( "#smallScrenn" ).removeClass( 'medium-6 columns' );
          $( "#smallScrenn" ).addClass( 'medium-12 columns' );
          $( ".FullScrenn" ).removeClass( 'medium-6 columns end' );
          $( ".FullScrenn" ).addClass( 'medium-3 columns end' );
        }
      }

    }
    // cargar más registros
    MoreRecords(){
      // console.log(this.eventos);
      this.showMap(false);
      this.startSpinner();
      let total_projects = this.countAllProjects;
      if(this.countProjects < total_projects){
        let diff = Number(total_projects) - Number(this.countProjects);
        if(diff > 4){
          this.resultProyecto = this.countProjects + this.contProyecto;
          let urlMoreRecords =  this.content.drupal_internal__id + '?items_per_page=' + this.resultProyecto;
          // console.log(urlMoreRecords);
          this.Service.getMoreDatos(urlMoreRecords).subscribe(
            (data) => (this.responseProject = data),
            (err) => console.log(),
            () => {
              if (this.responseProject) {
                this.countAllProjects = this.responseProject.total;
                this.allProjects = this.responseProject.search_results;
                this.countProjects = this.allProjects.length;
                for (let project of this.allProjects) {
                  var arrayDeCadenas = project.typology_images.split(',');
                  project.typology_images = arrayDeCadenas[0];
                  if(project.project_category.includes(',')){
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                  }else{
                    project.project_category = project.project_category + ','
                    console.log(project.project_category);
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                    console.log(typeof project.project_category);
                  }
                  /* format numbr */
                  project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
                  // Nueva linea Yenifer
                  var arrayDeLaton = project.latlon.split(',');
                  project.latitude = arrayDeLaton[0]
                  project.longitude = arrayDeLaton[1]
                  this.results = true;
                }
                this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
                /* si responde correctamente */

                if(this.responseProject.facets.property_type){
                  this.filterType = this.responseProject.facets.property_type;
                }
                if(this.responseProject.facets.project_city){
                  this.filterCity = this.responseProject.facets.project_city;
                }
                if(this.responseProject.facets.typology_price){
                  this.filterPrice = this.responseProject.facets.typology_price;
                }
                //Área m²
                if(this.responseProject.facets.area_built){
                  this.filterAreaBuilt = this.responseProject.facets.area_built;
                }
                //collection
                if(this.responseProject.facets.project_collection){
                  this.filterColection = this.responseProject.facets.project_collection;
                }
                // estados del proyecto
                if(this.responseProject.facets.project_feature){
                  let project_feature = this.responseProject.facets.project_feature;
                  for (let feature of project_feature) {
                    if(feature.values.value == "Estado del proyecto"){
                      this.filterProjectState = feature.children;
                      this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                    }
                  }
                }
                // Constructora
                if(this.responseProject.facets.project_builder){
                  this.filterBuilder = this.responseProject.facets.project_builder
                }
                /* Ordenación */
                if(this.responseProject.sorts){
                  this.filterSort = this.responseProject.sorts;
                }
                this.results = true;
              }
              /* si responde correctamente */
              if (this.responseProject.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          // if(this.resultProyecto == 32){
          //   console.log("debe de estar desactivado");
          //   this.banderaProyecto = true;
          // }
          this.stopSpinner();
        }else{
          this.resultProyecto = this.countProjects + diff;
          if(this.resultProyecto < 28 && this.resultProyecto > 24){
            this.resultProyecto = 28;
          }else if(this.resultProyecto < 32 && this.resultProyecto > 28){
            this.resultProyecto = 32;
          }
          let urlMoreRecords =  this.content.drupal_internal__id + '?items_per_page=' + this.resultProyecto;
          // console.log(urlMoreRecords);
          this.Service.getMoreDatos(urlMoreRecords).subscribe(
            (data) => (this.responseProject = data),
            (err) => console.log(),
            () => {
              if (this.responseProject) {
              // console.log(this.responseProject);
                this.countAllProjects = this.responseProject.total;
                this.allProjects = this.responseProject.search_results;
                this.countProjects = this.allProjects.length;
                for (let project of this.allProjects) {
                  var arrayDeCadenas = project.typology_images.split(',');
                  project.typology_images = arrayDeCadenas[0];
                  // if(project.project_category.includes(',')){
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                  // }else{
                  //   project.project_category = project.project_category + ','
                  //   // console.log(project.project_category);
                  //   var arrayDeCadenas2 = project.project_category.split(',');
                  //   project.project_category = arrayDeCadenas2;
                  //   // console.log(typeof project.project_category);
                  // }
                  /* format numbr */
                  project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
                  // Nueva linea Yenifer
                  var arrayDeLaton = project.latlon.split(',');
                  project.latitude = arrayDeLaton[0]
                  project.longitude = arrayDeLaton[1]
                  this.results = true;
                }
                this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
                /* si responde correctamente */

                if(this.responseProject.facets.property_type){
                  this.filterType = this.responseProject.facets.property_type;
                }
                if(this.responseProject.facets.project_city){
                  this.filterCity = this.responseProject.facets.project_city;
                }
                if(this.responseProject.facets.typology_price){
                  this.filterPrice = this.responseProject.facets.typology_price;
                }
                //Área m²
                if(this.responseProject.facets.area_built){
                  this.filterAreaBuilt = this.responseProject.facets.area_built;
                }
                //collection
                if(this.responseProject.facets.project_collection){
                  this.filterColection = this.responseProject.facets.project_collection;
                }
                // estados del proyecto
                if(this.responseProject.facets.project_feature){
                  let project_feature = this.responseProject.facets.project_feature;
                  for (let feature of project_feature) {
                    if(feature.values.value == "Estado del proyecto"){
                      this.filterProjectState = feature.children;
                      this.ValoresProyecto = Object.values(this.filterProjectState[0]);
                    }
                  }
                }
                // Constructora
                if(this.responseProject.facets.project_builder){
                  this.filterBuilder = this.responseProject.facets.project_builder
                }
                /* Ordenación */
                if(this.responseProject.sorts){
                  this.filterSort = this.responseProject.sorts;
                }
                this.results = true;

              }
              /* si responde correctamente */
              if (this.responseProject.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          // if(this.resultProyecto == 32){
          //   console.log("debe de estar desactivado");
          //   this.banderaProyecto = true;
          // }
          this.stopSpinner();
        }
      }else{
        this.banderaProyecto = true;
        this.stopSpinner();
      }
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
    ngAfterContentChecked() {
      $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > 230) {
          $("#filters-form").addClass("filters-float");
        }else{
          $("#filters-form").removeClass("filters-float");
        }
    });
    }
    decreaseValue(value) {
      this.startSpinner();
      if(value == 1){
        var val = $('#bedroom').val();
        if(val > 0){
          val = Number(val)-Number(1);
          if(this.filterBedrooms.length > 1){
            for(let bedrrom of this.filterBedrooms){
              if(bedrrom.values.value == String(val)){
                this.changeFeatures(bedrrom.url);
              }
            }
          }else{
            val = Number(val)+Number(1);
            this.stopSpinner();
          }
          $('#bedroom').val(val);
        }
      }else if(value == 2){
        var val = $('#bathroom').val();
        if(val > 0){
          val = Number(val)-Number(1);
          if(this.filterBathrooms.length > 1){
            for(let baths of this.filterBathrooms){
              if(baths.values.value == String(val)){
                this.changeFeatures(baths.url);
              }
            }
          }else{
            val = Number(val)+Number(1);
            this.stopSpinner();
          }
          $('#bathroom').val(val);
        }
      }else if(value == 3){
        var val = $('#garage').val();
        if(val > 0){
          val = Number(val)-Number(1);
          if(this.filterGarages.length > 1){
            for(let garage of this.filterGarages){
              if(garage.values.value == String(val)){
                this.changeFeatures(garage.url);
              }
            }
          }else{
            val = Number(val)+Number(1);
            this.stopSpinner();
          }
          $('#garage').val(val);
        }
      }
    }
    incrementValue(value) {
      this.startSpinner();
      if(value == 1){
        var val = $('#bedroom').val();
        val = Number(val)+Number(1);
        if(this.filterBedrooms.length > 1){
          for(let bedrrom of this.filterBedrooms){
            if(bedrrom.values.value == val){
              this.changeFeatures(bedrrom.url);
            }
          }
        }else{
          val = Number(val)-Number(1);
          this.stopSpinner();
        }
        $('#bedroom').val(val);
      }else if(value == 2){
        var val = $('#bathroom').val();
        val = Number(val)+Number(1);
        if(this.filterBathrooms.length > 1){
          for(let baths of this.filterBathrooms){
            if(baths.values.value == String(val)){
              this.changeFeatures(baths.url);
            }
          }
        }else{
          val = Number(val)-Number(1);
          this.stopSpinner();
        }
        $('#bathroom').val(val);
      }else if(value == 3){
        var val = $('#garage').val();
        val = Number(val)+Number(1);
        if(this.filterGarages.length > 1){
          for(let garage of this.filterGarages){
            if(garage.values.value == String(val)){
              this.changeFeatures(garage.url);
            }
          }
        }else{
          val = Number(val)-Number(1);
          this.stopSpinner();
        }
        $('#garage').val(val);
      }
    }
    changeFeatures(url){
      this.startSpinner();
      // this.urlActualProjects = url;
      // console.log(url);
      fetch(url, {
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        this.response = data;
        // console.log(this.response);
        if (this.response) {
          // console.log(this.response.search_results);
          this.response_data_project = this.response.search_results
          this.countProjects = this.response_data_project.length;
          this.countAllProjects = this.response.total;
          /* Iterar los proyectos a mostrar */
          for (let project of this.response_data_project) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            /* añadir latitud y longitud de proyectos */
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
          }
          this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
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
          if(this.response.facets.project_builder){
            this.filterBuilder = this.response.facets.project_builder
            for (let featureProjectBuilder of this.filterBuilder ) {
              if(featureProjectBuilder.values.active == "true"){
                this.optionsConstructoraSelected = featureProjectBuilder.url;
              }
            }
          }
          if(this.response.sorts){
            this.optionsSortSelected = '';
            for(let optionSort of this.response.sorts){
              if(optionSort.active == true){
                this.optionsSortSelected = optionSort.url;
              }
            }
            this.filterSort = this.response.sorts;
          }
          /* Baños */
          if(this.response.facets.bathrooms){
            this.filterBathrooms = this.response.facets.bathrooms;
            for (let featureBathrooms of this.filterBathrooms ) {
              if(featureBathrooms.values.active == "true"){
                this.optionsBathroomsSelected = featureBathrooms.url;
                $('#bathroom').val(Number(featureBathrooms.values.value));
              }
            }
          }
          /* Habitaciones */
          if(this.response.facets.bedrooms){
            this.filterBedrooms = this.response.facets.bedrooms;
            for (let featureBedroom of this.filterBedrooms ) {
              if(featureBedroom.values.active == "true"){
                this.optionsBedroomsSelected = featureBedroom.url;
                $('#bedroom').val(Number(featureBedroom.values.value));
              }
            }
          }
          /* Garajes */
          if(this.response.facets.garages){
            this.filterGarages = this.response.facets.garages;
            for (let featureGarage of this.filterGarages ) {
              if(featureGarage.values.active == "true"){
                this.optionsGaragesSelected = featureGarage.url;
                $('#garage').val(Number(featureGarage.values.value));
              }
            }
          }
          this.results = true;
          this.stopSpinner();
        }
      })
      .catch(error => console.error(error))
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
            if(project.project_category.includes(',')){
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
            }else{
              project.project_category = project.project_category + ','
              console.log(project.project_category);
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              console.log(typeof project.project_category);
            }
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            // Nueva linea Yenifer
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
          }
          this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
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
          /* Baños */
          if(this.response.facets.bathrooms){
            this.filterBathrooms = this.response.facets.bathrooms;
            for (let featureBathrooms of this.filterBathrooms ) {
              if(featureBathrooms.values.active == "true"){
                this.optionsBathroomsSelected = featureBathrooms.url;
                $('#bathroom').val(Number(featureBathrooms.values.value));
              }
            }
          }
          /* Habitaciones */
          if(this.response.facets.bedrooms){
            this.filterBedrooms = this.response.facets.bedrooms;
            for (let featureBedroom of this.filterBedrooms ) {
              if(featureBedroom.values.active == "true"){
                this.optionsBedroomsSelected = featureBedroom.url;
                $('#bedroom').val(Number(featureBedroom.values.value));
              }
            }
          }
          /* Garajes */
          if(this.response.facets.garages){
            this.filterGarages = this.response.facets.garages;
            for (let featureGarage of this.filterGarages ) {
              if(featureGarage.values.active == "true"){
                this.optionsGaragesSelected = featureGarage.url;
                $('#garage').val(Number(featureGarage.values.value));
              }
            }
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
            if(project.project_category.includes(',')){
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
            }else{
              project.project_category = project.project_category + ','
              console.log(project.project_category);
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              console.log(typeof project.project_category);
            }
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            // Nueva linea Yenifer
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
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
          /* Baños */
          if(this.response.facets.bathrooms){
            this.filterBathrooms = this.response.facets.bathrooms;
            for (let featureBathrooms of this.filterBathrooms ) {
              if(featureBathrooms.values.active == "true"){
                this.optionsBathroomsSelected = featureBathrooms.url;
                $('#bathroom').val(Number(featureBathrooms.values.value));
              }
            }
          }
          /* Habitaciones */
          if(this.response.facets.bedrooms){
            this.filterBedrooms = this.response.facets.bedrooms;
            for (let featureBedroom of this.filterBedrooms ) {
              if(featureBedroom.values.active == "true"){
                this.optionsBedroomsSelected = featureBedroom.url;
                $('#bedroom').val(Number(featureBedroom.values.value));
              }
            }
          }
          /* Garajes */
          if(this.response.facets.garages){
            this.filterGarages = this.response.facets.garages;
            for (let featureGarage of this.filterGarages ) {
              if(featureGarage.values.active == "true"){
                this.optionsGaragesSelected = featureGarage.url;
                $('#garage').val(Number(featureGarage.values.value));
              }
            }
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
            if(project.project_category.includes(',')){
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
            }else{
              project.project_category = project.project_category + ','
              console.log(project.project_category);
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              console.log(typeof project.project_category);
            }
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            // Nueva linea Yenifer
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
          }
          this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
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
          /* Baños */
          if(this.response.facets.bathrooms){
            this.filterBathrooms = this.response.facets.bathrooms;
            for (let featureBathrooms of this.filterBathrooms ) {
              if(featureBathrooms.values.active == "true"){
                this.optionsBathroomsSelected = featureBathrooms.url;
                $('#bathroom').val(Number(featureBathrooms.values.value));
              }
            }
          }
          /* Habitaciones */
          if(this.response.facets.bedrooms){
            this.filterBedrooms = this.response.facets.bedrooms;
            for (let featureBedroom of this.filterBedrooms ) {
              if(featureBedroom.values.active == "true"){
                this.optionsBedroomsSelected = featureBedroom.url;
                $('#bedroom').val(Number(featureBedroom.values.value));
              }
            }
          }
          /* Garajes */
          if(this.response.facets.garages){
            this.filterGarages = this.response.facets.garages;
            for (let featureGarage of this.filterGarages ) {
              if(featureGarage.values.active == "true"){
                this.optionsGaragesSelected = featureGarage.url;
                $('#garage').val(Number(featureGarage.values.value));
              }
            }
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
            if(project.project_category.includes(',')){
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
            }else{
              project.project_category = project.project_category + ','
              console.log(project.project_category);
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              console.log(typeof project.project_category);
            }
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            // Nueva linea Yenifer
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
          }
          this.setLocationProject(this.allProjects[0].latitude,this.allProjects[0].longitude);
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
          /* Baños */
          if(this.response.facets.bathrooms){
            this.filterBathrooms = this.response.facets.bathrooms;
            for (let featureBathrooms of this.filterBathrooms ) {
              if(featureBathrooms.values.active == "true"){
                this.optionsBathroomsSelected = featureBathrooms.url;
                $('#bathroom').val(Number(featureBathrooms.values.value));
              }
            }
          }
          /* Habitaciones */
          if(this.response.facets.bedrooms){
            this.filterBedrooms = this.response.facets.bedrooms;
            for (let featureBedroom of this.filterBedrooms ) {
              if(featureBedroom.values.active == "true"){
                this.optionsBedroomsSelected = featureBedroom.url;
                $('#bedroom').val(Number(featureBedroom.values.value));
              }
            }
          }
          /* Garajes */
          if(this.response.facets.garages){
            this.filterGarages = this.response.facets.garages;
            for (let featureGarage of this.filterGarages ) {
              if(featureGarage.values.active == "true"){
                this.optionsGaragesSelected = featureGarage.url;
                $('#garage').val(Number(featureGarage.values.value));
              }
            }
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
    addFavorite(value) {
      const user_login = sessionStorage.getItem('access_token');
      const user_uid = sessionStorage.getItem('uid');
      if(user_login === null || user_uid === null){
        this.router.navigate(['login']);
      }else{
        if (!sessionStorage['favorite']) {
          var ids = [];
          ids.push(value)
          sessionStorage.setItem('favorite',JSON.stringify(ids))
          var storedIds = JSON.parse(sessionStorage.getItem("id"));
          // this.router.navigate(['comparador']);
          // console.log('este es el id: ',storedIds);
        }else{
          var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
          if(storedIds.indexOf( value ) !== 1){
            storedIds.push(value);
          }
          /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
          sessionStorage.setItem('favorite',JSON.stringify(storedIds))
          // this.router.navigate(['comparador']);
          // console.log('este es el id: ',storedIds);
        }
      }
    }
}
