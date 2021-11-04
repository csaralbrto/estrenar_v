import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {NgModule, LOCALE_ID} from '@angular/core';
import { ProjectsService } from './projects.service';
import { MapsAPILoader } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateIsoStorageTranscoder } from 'ngx-webstorage-service';
declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [ProjectsService],
})
export class ProjectsComponent implements OnInit, AfterViewChecked {
  tags: MetaTag;
  public data: any = {nodes: [], pagination: 0};
  public response_data_project: any;
  public response_data_more_project:any;
  public responseSubmit: any;
  public response: any;
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
  public titleLabel: any;
  public wordLabel: any;
  public mapTypeId: any;
  public form_filters: FormGroup;
  public form_moreFilters: FormGroup;
  public form: FormGroup;
  public resutls: boolean = false;
  public route = 'filtro-proyectos';
  public url_search_word = 'https://lab.estrenarvivienda.com/api/typologies/all?search=';
  public url_search_collection = 'https://lab.estrenarvivienda.com/api/typologies/project_collection/';
  public stringQuery = '';
  public eventos : boolean = false;
  public countProjects = '';
  public countAllProjects = '';
  public urlActualProjects: any;
  optionsTypySelected: string = '';
  optionsPriceSelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';
  optionsAreaSelected: string = '';
  optionsCollectionSelected: string = '';
  optionsConstructoraSelected: string = '';
  optionsBathroomsSelected: string = '';
  optionsBedroomsSelected: string = '';
  optionsGaragesSelected: string = '';
  optionFeatureProyectSelected:string ='';
  optionsSortSelected:string ='';
  path_favorites = "";


  // stateSelected: string = '';
  // Mas filtro
  Habitaciones: any;

  public xcsrfToken: any;
  public client_id = '21f24499-5493-4609-b204-f9181350de5d';
  public cliente_secret = 'drupal';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public collectionActive: string = '';
  public results = false;
  public ValoresProyecto: any;
  public icon_ev = './assets/images/markets/pin-verde.svg';

  constructor( public Service: ProjectsService, private formBuilder: FormBuilder, private meta: Meta, private router: Router,private spinnerService: NgxSpinnerService,private mapsAPILoader: MapsAPILoader  ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';
  latitude: number;
  longitude: number;
  zoom:number;
  contProyecto:number = 4;
  resultProyecto:number = 8;
  banderaProyecto  = false;

  ngOnInit() {
    this.collectionActive = this.route;
    this.banderaProyecto  = false;
    this.startSpinner();
    this.createForm();
    this.createForm2();
    this.createFormMoreFilters();
    // this.setCurrentLocation();
    /* Validar la url de favoritos */
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    if(user_login === null || user_uid === null){
      this.path_favorites = "login";
    }else{
      this.path_favorites = "favoritos";
    }
    // const title = this.activatedRoute.snapshot.params.path ;
    let title_label  = sessionStorage['projectTitle']?sessionStorage.getItem("projectTitle"):null;
    let word_label  = sessionStorage['wordTitle']?sessionStorage.getItem("wordTitle"):null;
    let get_filter_price  = sessionStorage['price_search']?sessionStorage.getItem("price_search"):null;
    let get_project_price  = sessionStorage['price_projects']?sessionStorage.getItem("price_projects"):null;
    let get_filter_word  = sessionStorage['word_search']?sessionStorage.getItem("word_search"):null;
    let get_collection_id  = sessionStorage['collection_id']?sessionStorage.getItem("collection_id"):null;
    let word_label_collection  = sessionStorage['wordTitleCollection']?sessionStorage.getItem("wordTitleCollection"):null;
    // console.log(sessionStorage.getItem("projectTitle"));
    if(title_label && title_label !== null){
      this.titleLabel = title_label;
      sessionStorage.removeItem('projectTitle');
      this.filterByWord(this.titleLabel);
    }else if(word_label && word_label !== null){
      this.wordLabel = word_label;
      sessionStorage.removeItem('wordTitle');
      this.filterByWord(this.wordLabel);
    }else if(get_filter_price && get_filter_price !== null){
        sessionStorage.removeItem("price_search");
        this.filterByPrice(get_filter_price);
    }else if(get_project_price && get_project_price !== null){
        sessionStorage.removeItem("price_projects");
        this.filterProjectPrice(get_project_price);
    }else if(get_filter_word && get_filter_word !== null){
        sessionStorage.removeItem("word_search");
        this.filterByWord(get_filter_word);
    }else if(get_collection_id && get_collection_id !== null){
      sessionStorage.removeItem("collection_id");
      this.wordLabel = word_label_collection
      this.filterByCollection(get_collection_id);
    }else{
      /* Método para obtener toda la info de proyectos */
      // console.log(this.resultProyecto);
      this.urlActualProjects = 'https://lab.estrenarvivienda.com/es/api/typologies?items_per_page='+this.resultProyecto;
      this.Service.getData(this.resultProyecto).subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            console.log(this.response);
            if(this.response.metatag_normalized){
              this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
            }
            // console.log('entre al else');
            this.response_data_project = this.response.search_results
            this.countProjects = this.response_data_project.length;
            this.countAllProjects = this.response.total;
            /* Iterar sobre los proyectos */
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              // Nueva linea Yenifer
              var arrayDeLaton = project.latlon.split(',');
              project.latitude = arrayDeLaton[0]
              project.longitude = arrayDeLaton[1]

              /* format numbr */
              project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            }
            this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
            /* Iterar sobre los Filtros de proyectos */
            if(this.response.facets.property_type){
              this.filterType = this.response.facets.property_type;
            }
            if(this.response.facets.project_city){
              this.filterCity = this.response.facets.project_city;
            }
            if(this.response.facets.typology_price){
              this.filterPrice = this.response.facets.typology_price;
            }
            //Área m²
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
            /* Baños */
            if(this.response.facets.bathrooms){
              this.filterBathrooms = this.response.facets.bathrooms;
            }
            /* Habitaciones */
            if(this.response.facets.bedrooms){
              this.filterBedrooms = this.response.facets.bedrooms;
            }
            /* Garajes */
            if(this.response.facets.garages){
              this.filterGarages = this.response.facets.garages;
            }
            this.results = true;
            this.stopSpinner();
          }
          /* si responde correctamente */
          if (this.response_data_project.error) {
            /* si hay error en la respuesta */
          }
        }
      );
    }
  }
  /* Obtener la locacion en coordenadas actual */
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 9;
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
  //  console.log("contador "+ this.contProyecto);
  //  console.log("resultado "+ this.resultProyecto);
    this.resultProyecto = this.resultProyecto + this.contProyecto;
    // console.log(this.resultProyecto);
    let newUrl = this.urlActualProjects.split('?items_per_page=');
    this.urlActualProjects = newUrl[0] + '?items_per_page=' + this.resultProyecto;
    console.log(this.urlActualProjects);

    this.Service.getMoreData(this.urlActualProjects).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          if(this.response.metatag_normalized){
            this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
          }
          this.response_data_more_project = this.response.search_results;
          this.response_data_project =  this.response_data_more_project;
          this.countProjects = this.response_data_project.length;
          this.countAllProjects = this.response.total;
          /* Iterar sobre los proyectos */

          for (let project of this.response_data_more_project) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            // Nueva linea Yenifer
            var arrayDeLaton = project.latlon.split(',');
            project.latitude = arrayDeLaton[0]
            project.longitude = arrayDeLaton[1]
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
          }
          this.results = true;
          this.stopSpinner();
        }
        /* si responde correctamente */
        if (this.response_data_project.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    if(this.resultProyecto == 32){
      console.log("debe de estar desactivado");
      this.banderaProyecto = true;
    }
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
        $('#bedroomMobile').val(val);
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
        $('#bathroomMobile').val(val);
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
        $('#garageMobile').val(val);
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
      $('#bedroomMobile').val(val);
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
      $('#bathroomMobile').val(val);
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
      $('#garageMobile').val(val);
    }
  }
  clickCollection(url){
    console.log(url);
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
          this.optionsSortSelected = '';
          for(let optionSort of this.response.sorts){
            if(optionSort.active == true){
              this.optionsSortSelected = optionSort.url;
            }
          }
          this.filterSort = this.response.sorts;
          // this.stopSpinner();
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
  change(value) {
    this.startSpinner();
    // this.bandera = false;
    this.showMap(false);
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
    this.urlActualProjects = url;
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
  changeFeatures(url){
    this.startSpinner();
    this.urlActualProjects = url;
    console.log(url);
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
  changeSort(type) {
    this.startSpinner();
    if(type == 'mobile'){
      this.stringQuery = $('#sortByMobile option:selected').val();
    }else{
      this.stringQuery = $('#sortByDesktop option:selected').val();
    }
    this.showMap(false);
    // this.stringQuery = $('#sortBy option:selected').val();
    // console.log(this.stringQuery);
    // this.beforeCheck(this.response.individual);}
    var url = this.stringQuery;
    // console.log(url);
    var data = "";
    this.urlActualProjects = url;
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
        // console.log('ordenación: ', this.response.sorts);
        for (let project of this.response_data_project) {
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
        this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
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
  cleanFilter(){
    location.reload();
  }
  onBuscarClick(){
    console.log("onBuscarClick");
    console.log("costructora" + this.optionsConstructoraSelected);
    console.log("optionsAreaSelected "+this.optionsAreaSelected);
    console.log("habitaciones "+this.Habitaciones);
  }
  consultItemChanged(itemSelected:any){
    console.log("itemSelected "+itemSelected);
    console.log("costructora " + this.optionsConstructoraSelected);
  }
  filterByPrice(value) {
    var url = value;
    var data = "";
    this.urlActualProjects = url;
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
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
          var arrayDeLaton = project.latlon.split(',');
          /* añadir latitud y longitud de proyectos */
          var arrayDeLaton = project.latlon.split(',');
          project.latitude = arrayDeLaton[0]
          project.longitude = arrayDeLaton[1]
          project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price)
        }
        this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
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
        //Área m²
        if(this.response.facets.area_built){
          this.filterAreaBuilt = this.response.facets.area_built;
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
        /* Baños */
        if(this.response.facets.bathrooms){
          this.filterBathrooms = this.response.facets.bathrooms;
        }
        /* Habitaciones */
        if(this.response.facets.bedrooms){
          this.filterBedrooms = this.response.facets.bedrooms;
        }
        /* Garajes */
        if(this.response.facets.garages){
          this.filterGarages = this.response.facets.garages;
        }
        this.results = true;
        // this.banderaProyecto = true;
        this.stopSpinner();
      }
    })
    .catch(error => console.error(error))
  }
  filterProjectPrice(value) {
    value = Number(value) - Number(10000000);
    if(Number(value) < 0){
      value = 0;
    }
    let value2 = Number(value) + Number(20000000);
    var url = 'https://lab.estrenarvivienda.com/api/typologies?page=0&price[min]='+ value + '&price[max]=' + value2 + '&items_per_page=8';
    console.log(url);
    this.urlActualProjects = url;
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
        this.response_data_project = this.response.search_results
        this.countProjects = this.response_data_project.length;
        this.countAllProjects = this.response.total;
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
          var arrayDeLaton = project.latlon.split(',');
          /* añadir latitud y longitud de proyectos */
          var arrayDeLaton = project.latlon.split(',');
          project.latitude = arrayDeLaton[0]
          project.longitude = arrayDeLaton[1]
          project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price)
        }
        this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
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
        //Área m²
        if(this.response.facets.area_built){
          this.filterAreaBuilt = this.response.facets.area_built;
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
        /* Baños */
        if(this.response.facets.bathrooms){
          this.filterBathrooms = this.response.facets.bathrooms;
        }
        /* Habitaciones */
        if(this.response.facets.bedrooms){
          this.filterBedrooms = this.response.facets.bedrooms;
        }
        /* Garajes */
        if(this.response.facets.garages){
          this.filterGarages = this.response.facets.garages;
        }
        this.results = true;
        this.stopSpinner();
      }
    })
    .catch(error => console.error(error))
  }
  filterByWord(value) {
    var url = this.url_search_word + value;
    var data = "";
    this.urlActualProjects = url;
    fetch(url, {
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
      // console.log(this.response);
      if (this.response) {
        // console.log(this.response.search_results);
        this.response_data_project = this.response
        this.countProjects = this.response_data_project.length;
        this.countAllProjects = this.response_data_project.length;
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
          /* añadir latitud y longitud de proyectos */
          var arrayDeLaton = project.latlon.split(',');
          project.latitude = arrayDeLaton[0]
          project.longitude = arrayDeLaton[1]
          project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price)
        }
        this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
        /* Método para obtener toda la info de proyectos */
        this.Service.getData(this.resultProyecto).subscribe(
          (data) => (this.response = data),
          (err) => console.log(),
          () => {
            if (this.response) {
              // console.log(this.response.facets.typology_price);
              if(this.response.metatag_normalized){
                this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
              }
              if(this.response.facets.property_type){
                this.filterType = this.response.facets.property_type;
              }
              if(this.response.facets.project_city){
                this.filterCity = this.response.facets.project_city;
              }
              if(this.response.facets.typology_price){
                this.filterPrice = this.response.facets.typology_price;
              }
              //Área m²
              if(this.response.facets.area_built){
                this.filterAreaBuilt = this.response.facets.area_built;
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
              /* Baños */
              if(this.response.facets.bathrooms){
                this.filterBathrooms = this.response.facets.bathrooms;
              }
              /* Habitaciones */
              if(this.response.facets.bedrooms){
                this.filterBedrooms = this.response.facets.bedrooms;
              }
              /* Garajes */
              if(this.response.facets.garages){
                this.filterGarages = this.response.facets.garages;
              }
              this.results = true;
            }
            /* si responde correctamente */
            if (this.response_data_project.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        this.banderaProyecto = true;
        this.results = true;
        this.stopSpinner();
      }
    })
    .catch(error => console.error(error))
  }
  filterByCollection(value) {
    this.urlActualProjects = this.url_search_collection + value;
    var url = this.url_search_collection + value + '?items_per_page=8';
    console.log(url);
    var data = "";
    fetch(url, {
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
      // console.log(this.response);
          if (this.response) {
            console.log(this.response);
            if(this.response.metatag_normalized){
              this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
            }
            // console.log('entre al else');
            this.response_data_project = this.response.search_results
            this.countProjects = this.response_data_project.length;
            this.countAllProjects = this.response.total;
            /* Iterar sobre los proyectos */
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              // Nueva linea Yenifer
              var arrayDeLaton = project.latlon.split(',');
              project.latitude = arrayDeLaton[0]
              project.longitude = arrayDeLaton[1]
              project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price)
            }
            this.setLocationProject(this.response_data_project[0].latitude,this.response_data_project[0].longitude);
            /* Iterar sobre los Filtros de proyectos */
            if(this.response.facets.property_type){
              this.filterType = this.response.facets.property_type;
            }
            if(this.response.facets.project_city){
              this.filterCity = this.response.facets.project_city;
            }
            if(this.response.facets.typology_price){
              this.filterPrice = this.response.facets.typology_price;
            }
            //Área m²
            if(this.response.facets.area_built){
              this.filterAreaBuilt = this.response.facets.area_built;
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
            /* Baños */
            if(this.response.facets.bathrooms){
              this.filterBathrooms = this.response.facets.bathrooms;
            }
            /* Habitaciones */
            if(this.response.facets.bedrooms){
              this.filterBedrooms = this.response.facets.bedrooms;
            }
            /* Garajes */
            if(this.response.facets.garages){
              this.filterGarages = this.response.facets.garages;
            }
            this.results = true;
            this.stopSpinner();
          }
    })
    .catch(error => console.error(error))
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
      this.startSpinner();
      $('#exampleModal2').foundation('close');
      /* Se recibe los valores del formulario */
      var f = new Date();
      var date = f.getFullYear()+ "-" + (f.getMonth() +1) + "-" + f.getDate() + "T" + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
      values.type_submit = 'contact_form';
      var url = window.location.href;
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
                    "UTM source": sessionStorage['UTMSource']?sessionStorage.getItem("UTMSource"):null
                },
                {
                    "UTM medium": sessionStorage['UTMMedium']?sessionStorage.getItem("UTMMedium"):null
                },
                {
                    "UTM content": sessionStorage['UTMContent']?sessionStorage.getItem("UTMContent"):null
                },
                {
                    "UTM campaign": sessionStorage['UTMCampaing']?sessionStorage.getItem("UTMCampaing"):null
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
    console.log(payload);
      this.Service.getFormService( payload )
      .subscribe(
        data =>(this.responseSubmit = data),
        err => console.log(),
        () => {
          if(this.responseSubmit){
            if(this.responseSubmit.error){
              console.log(this.responseSubmit);
              this.stopSpinner();
              $('#exampleModalContactErrorProject').foundation('open');
              this.form.reset();
            }else{
              console.log(this.responseSubmit);
              this.stopSpinner();
              $('#exampleModalContactProject').foundation('open');
              this.form.reset();
            }
          }
          if(!this.responseSubmit.id){
            // $('#modalAlertError').foundation('open');
          }
        }
      );
    }
  }
  ngAfterViewChecked() {
    if (this.results) {
      // this.stopSpinner();
      $('app-projects').foundation();
      // $('html,body').scrollTop(0);
    }
  }
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
  goFavorites(){
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    if(!sessionStorage['favorite']){
      // this.router.navigate(['login']);
    }else{
      let favorites = [];
      var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
      let count = 0
      for (let ids of storedIds) {
        favorites.push({"target_id": ids})
      }
      let payload = {
      "field_user_favorites": favorites
      }
      this.router.navigate(['favoritos']);
      // fetch("https://lab.estrenarvivienda.com/es/session/token")
      // .then(response => response.text())
      // .then(result => {
      //   this.xcsrfToken = result
      //   console.log('voy a before update');
      //   this.beforeUpdate(this.xcsrfToken, payload);
      // })
      // .catch(error => console.log('error', error));
    }
  }
  beforeUpdate(xcsrfToken, payload){
    var url = 'https://lab.estrenarvivienda.com/es/oauth/token';
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", this.client_id);
    urlencoded.append("client_secret", this.cliente_secret);
    urlencoded.append("username", this.cliente_secret);
    urlencoded.append("password", this.cliente_secret);
      fetch(url, {
        body: urlencoded,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        redirect: 'follow',
      })
      .then(function (a) {
          return a.json();
      })
     .then(result => {
       console.log('result',result)
       if(result.access_token){
        var now = new Date();
        now.setSeconds(now.getSeconds() + result.expires_in)
        var timeObject = {
          time : now
        };
         localStorage.removeItem('access_token');
         sessionStorage.setItem('access_token',result.access_token);
         localStorage.removeItem('time_out');
         sessionStorage.setItem('time_out',JSON.stringify(timeObject));
         console.log('voy a update user');
         this.updateUser(xcsrfToken, payload);

       }
      })
     .catch(error => {
        console.error(error);
      });
  }
  updateUser(xcsrfToken, payload){
    console.log('entre a update user',xcsrfToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-CSRF-Token", xcsrfToken);
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('access_token'));
    var raw = JSON.stringify(payload);
    let url = 'https://lab.estrenarvivienda.com/es/user/';
    let url_last = '?_format=json';

    fetch(url + sessionStorage.getItem('uid') + url_last, {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.text())
      .then(result =>{
        console.log(result)
      })
      .catch(error => console.log('error', error));
  }
  removeFilter(value){
    if(this.optionsTypySelected == value){
      this.optionsTypySelected = "";
    }else if(this.optionsPriceSelected == value){
      this.optionsPriceSelected = "";
    }else if(this.optionsCitySelected == value){
      this.optionsCitySelected = "";
    }else if(this.optionsZoneSelected == value){
      this.optionsZoneSelected = "";
    }else if(this.optionsSectorSelected == value){
      this.optionsSectorSelected = "";
    }
  }
  /* Metodos Cargando */
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

}
