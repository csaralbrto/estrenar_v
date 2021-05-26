import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public responseSubmit: any;
  public response: any;
  public filterType: any;
  public filterPrice: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public titleLabel: any;
  public wordLabel: any;
  public form_filters: FormGroup;
  public form: FormGroup;
  public resutls: boolean = false;
  public route = 'filtro-proyectos';
  public url_search_word = 'https://lab.estrenarvivienda.com/es/api/typologies/all?search=';
  public stringQuery = '';
  optionsTypySelected: string = '';
  optionsPriceSelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';
  public xcsrfToken: any;
  public client_id = 'f90aca17-a17b-4147-94a7-e91784e70c38';
  public cliente_secret = 'drupal';
  public query_elasticsearch = {
    'filtro-proyectos': {term: '', fields: ''}
  };
  public collectionActive: string = '';
  public results = false;

  constructor( public Service: ProjectsService, private formBuilder: FormBuilder, private meta: Meta, private router: Router,private spinnerService: NgxSpinnerService  ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';


  ngOnInit() {
    this.collectionActive = this.route;
    this.startSpinner();
    this.createForm();
    this.createForm2();
    // const title = this.activatedRoute.snapshot.params.path ;
    let title_label  = sessionStorage['projectTitle']?sessionStorage.getItem("projectTitle"):null;
    let word_label  = sessionStorage['wordTitle']?sessionStorage.getItem("wordTitle"):null;
    let get_filter_price  = sessionStorage['price_search']?sessionStorage.getItem("price_search"):null;
    let get_project_price  = sessionStorage['price_projects']?sessionStorage.getItem("price_projects"):null;
    let get_filter_word  = sessionStorage['word_search']?sessionStorage.getItem("word_search"):null;
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
    }else{
      /* Método para obtener toda la info de proyectos */
      this.Service.getData().subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            // console.log(this.response.facets.typology_price);
            if(this.response.metatag_normalized){
              this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
            }
            console.log('entre al else');
            this.response_data_project = this.response.search_results
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
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
            this.results = true;
          }
          /* si responde correctamente */
          if (this.response_data_project.error) {
            /* si hay error en la respuesta */
          }
        }
      );
    }
  }
  decreaseValue(value) {
    if(value == 1){
      var val = $('#bedroom').val();
      val = Number(val)-Number(1);
      $('#bedroom').val(val);
    }else if(value == 2){
      var val = $('#bathroom').val();
      val = Number(val)-Number(1);
      $('#bathroom').val(val);
    }else if(value == 3){
      var val = $('#garage').val();
      val = Number(val)-Number(1);
      $('#garage').val(val);
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
  change(value) {
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
        // console.log(this.response.search_results);
        this.response_data_project = this.response.search_results
        for (let project of this.response_data_project) {
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
  filterByPrice(value) {
    var url = value;
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
        for (let project of this.response_data_project) {
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
  filterProjectPrice(value) {
    value = Number(value) - Number(10000000);
    if(Number(value) < 0){
      value = 0;
    }
    let value2 = Number(value) + Number(20000000);
    var url = 'https://lab.estrenarvivienda.com/es/api/typologies?page=0&price[min]='+ value + '&price[max]=' + value2 + '&items_per_page=8';
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
        // console.log(this.response.search_results);
        this.response_data_project = this.response.search_results
        for (let project of this.response_data_project) {
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
  filterByWord(value) {
    var url = this.url_search_word + value;
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
        this.response_data_project = this.response
        for (let project of this.response_data_project) {
          var arrayDeCadenas = project.typology_images.split(',');
          project.typology_images = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.project_category.split(',');
          project.project_category = arrayDeCadenas2;
        }
        /* Método para obtener toda la info de proyectos */
        this.Service.getData().subscribe(
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
              this.results = true;
            }
            /* si responde correctamente */
            if (this.response_data_project.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        this.results = true;
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
  ngAfterViewChecked() {
    if (this.results) {
      this.stopSpinner();
      $('app-projects').foundation();
      // $('html,body').scrollTop(0);
    }
  }
  addFavorite(value) {
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    // if(user_login === null || user_uid === null){
    //   this.router.navigate(['login']);
    // }else{
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
    // }
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
  // Metodos Cargando

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
