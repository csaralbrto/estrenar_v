import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FavoritesService } from './favorites.service';
import { MapsAPILoader } from '@agm/core';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  providers: [FavoritesService],
})
export class FavoritesComponent implements OnInit {
  public data: any = {nodes: [], pagination: 0};
  public response: any;
  public response_data_project: any;
  public form_filters: FormGroup;
  public filterType: any;
  public filterPrice: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public filterSort: any;
  public mapTypeId: any;
  public results = false;
  public route = 'filtro-proyectos';
  public stringQuery = '';
  public countProjects = '';
  optionsTypySelected: string = '';
  optionsPriceSelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';
  optionsSortSelected: string = '';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public collectionActive: string = '';

  constructor( public Service: FavoritesService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,private spinnerService: NgxSpinnerService,private router: Router ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom:number;

  ngOnInit(): void {
    this.startSpinner();
    this.collectionActive = this.route;
    this.createForm();
    this.setCurrentLocation();

    // Favoritos
    var stringQuery = "";
    if (sessionStorage['favorite']) {
      var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
      for (let ids of storedIds) {
        stringQuery = stringQuery+ids+"+";
      }
      stringQuery = stringQuery.substring(0, stringQuery.length - 1);
      console.log(stringQuery);
      /* Método para obtener toda la info de proyectos */
      this.Service.favoriteData( stringQuery )
      .subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            // console.log(this.response);
            this.response_data_project = this.response.search_results
            this.countProjects = this.response_data_project.length;
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              var arrayDeLaton = project.latlon.split(',');
              project.latitude = arrayDeLaton[0]
              project.longitude = arrayDeLaton[1]
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
            if(this.response.sorts){
              this.filterSort = this.response.sorts;
            }
            console.log(this.response_data_project);
            // for (let project of this.response.busqueda) {
            //   if (project.url_img) {
            //     this.largo = project.url_img.length;
            //     this.cadena = project.url_img.substr(53, this.largo);
            //     project.url_img = this.dataPath + this.cadena;
            //   }
            // }
            // for (let project of this.response.recomendados) {
            //   if (project.url_img) {
            //     this.largo = project.url_img.length;
            //     this.cadena = project.url_img.substr(53, this.largo);
            //     project.url_img = this.dataPath + this.cadena;
            //   }
            // }
          this.results = true;
          this.stopSpinner();
          }
          /* si responde correctamente */
          if (this.response.error) {
            /* si hay error en la respuesta */
          }
        }
      );
    }
  }
  ngAfterViewChecked() {
    if (this.results) {
      // sessionStorage.removeItem('qtEmails');
      $('app-favorites').foundation();
      /* eliminamos los item de email y telefono */
      // sessionStorage.removeItem('qtEmails');
      // sessionStorage.removeItem('qtPhones');
      // $('html,body').scrollTop(0);

    }
  }


  removeFavorite(value) {
    // console.log("ingreso "+ value);

    var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
    /* remover el proyecto de los coparadores */
    const index = storedIds.indexOf(value);
    storedIds.splice(index, 1);
    /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
    sessionStorage.removeItem("favorite");
    sessionStorage.setItem('favorite',JSON.stringify(storedIds))
   // this.router.navigate(['comparador']);
    console.log('este es el id: ',storedIds);
    if(storedIds.length > 0){
      window.location.reload();
    }else{
      this.router.navigate(['home']);
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
  change(value) {
    this.startSpinner();
    console.log(value);
    this.stringQuery = "";
    Object.keys(value).forEach( function(key) {
      if(value[key] && value[key] !== 'Seleccione'){
        this.stringQuery = value[key];
      }
    },this);
    console.log(this.stringQuery);
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
        console.log(this.response);
        // console.log(this.response.search_results);
        this.response_data_project = this.response.search_results
        this.countProjects = this.response_data_project.length;
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
          var arrayDeLaton = project.latlon.split(',');
          project.latitude = arrayDeLaton[0]
          project.longitude = arrayDeLaton[1]
        }
        if(this.response.facets.property_type){
          this.optionsTypySelected = '';
          for(let optionType of this.response.facets.property_type){
            if(optionType.values.active == 'true'){
              this.optionsTypySelected = optionType.url;
            }
          }
          this.filterType = this.response.facets.property_type;
          this.stopSpinner();
        }
        if(this.response.facets.project_city){
          this.optionsCitySelected = '';
          for(let optionCity of this.response.facets.project_city){
            if(optionCity.values.active == 'true'){
              this.optionsCitySelected = optionCity.url;
            }
          }
          this.filterCity = this.response.facets.project_city;
          this.stopSpinner();
        }
        if(this.response.facets.typology_price){
          // console.log("debo de parar3");
          this.optionsPriceSelected = '';
          for(let optionPrice of this.response.facets.typology_price){
            if(optionPrice.values.active == 'true'){
              this.optionsPriceSelected = optionPrice.url;
            }
          }
          this.filterPrice = this.response.facets.typology_price;
          this.stopSpinner();
        }
        if(this.response.facets.project_zone){
          this.optionsZoneSelected = '';
          for(let optionZone of this.response.facets.project_zone){
            if(optionZone.values.active == 'true'){
              this.optionsZoneSelected = optionZone.url;
            }
          }
          this.filterZone = this.response.facets.project_zone;
          this.stopSpinner();
        }
        if(this.response.facets.project_neighborhood){
          this.optionsSectorSelected = '';
          for(let optionSector of this.response.facets.project_neighborhood){
            if(optionSector.values.active == 'true'){
              this.optionsSectorSelected = optionSector.url;
            }
          }
          this.filterSector = this.response.facets.project_neighborhood;
          this.stopSpinner();
        }
        if(this.response.sorts){
          this.optionsSectorSelected = '';
          for(let optionSector of this.response.sorts){
            if(optionSector.values.active == 'true'){
              this.optionsSortSelected = optionSector.url;
            }
          }
          this.filterSort = this.response.sorts;
          this.stopSpinner();
          console.log("debo de parar");
        }
        this.results = true;

        // this.stopSpinner();

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
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
          var arrayDeLaton = project.latlon.split(',');
          project.latitude = arrayDeLaton[0]
          project.longitude = arrayDeLaton[1]
        }
        if(this.response.facets.property_type){
          // this.optionsTypySelected = '';
          // for(let optionType of this.response.facets.property_type){
          //   if(optionType.values.active == 'true'){
          //     this.optionsTypySelected = optionType.url;
          //   }
          // }
          this.filterType = this.response.facets.property_type;
        }
        if(this.response.facets.project_city){
          // this.optionsCitySelected = '';
          // for(let optionCity of this.response.facets.project_city){
          //   if(optionCity.values.active == 'true'){
          //     this.optionsCitySelected = optionCity.url;
          //   }
          // }
          this.filterCity = this.response.facets.project_city;
        }
        if(this.response.facets.typology_price){
          // this.optionsPriceSelected = '';
          // for(let optionPrice of this.response.facets.typology_price){
          //   if(optionPrice.values.active == 'true'){
          //     this.optionsPriceSelected = optionPrice.url;
          //   }
          // }
          this.filterPrice = this.response.facets.typology_price;
        }
        if(this.response.facets.project_zone){
          // this.optionsZoneSelected = '';
          // for(let optionZone of this.response.facets.project_zone){
          //   if(optionZone.values.active == 'true'){
          //     this.optionsZoneSelected = optionZone.url;
          //   }
          // }
          this.filterZone = this.response.facets.project_zone;
        }
        if(this.response.facets.project_neighborhood){
          console.log("cambie");
          // this.optionsSectorSelected = '';
          // for(let optionSector of this.response.facets.project_neighborhood){
          //   if(optionSector.values.active == 'true'){
          //     this.optionsSectorSelected = optionSector.url;
          //   }
          // }
          this.filterSector = this.response.facets.project_neighborhood;
        }
        if(this.response.sorts){
          console.log("cambie2");

          // this.optionsSectorSelected = '';
          // for(let optionSector of this.response.sorts){
          //   if(optionSector.values.active == 'true'){
          //     this.optionsSortSelected = optionSector.url;
          //   }
          // }
          this.filterSort = this.response.sorts;
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
      sortBy: new FormControl('Seleccione'),
    });
  }
  // showMap(){
  //   $('#favoritesMap').toggleClass('hide')
  //   $('#fullFavorites').toggleClass('hide')
  // }
  // changeViewTipeAGM(type) {
  //   this.viewType = type;  //for default 'hybrid'
  //   }

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
