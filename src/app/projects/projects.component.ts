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
  public responseSubmit: any;
  public response: any;
  public filterType: any;
  public filterPrice: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public form_filters: FormGroup;
  public form: FormGroup;
  public resutls: boolean = false;
  public route = 'filtro-proyectos';
  public stringQuery = '';
  optionsTypySelected: string = '';
  optionsPriceSelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';
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
    this.createForm2();

    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response.search_results);
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

    // this.beforeCheck(this.response.individual);
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
      $('app-projects').foundation();
      // $('html,body').scrollTop(0);
    }
  }

}
