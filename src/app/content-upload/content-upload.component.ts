import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup,FormControl,FormBuilder,Validators } from '@angular/forms';
import { ContentUploadService } from './content-upload.service';
declare let $: any;
declare const google: any;

@Component({
  selector: 'app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [ContentUploadService],
})
export class ContentUploadComponent implements OnInit {
  public confirm: any;
  public form: FormGroup;
  public formTypology: FormGroup;
  public results = false;
  public responseSearchData: any;
  public responseAllData: any;
  public responseTypologyData: any;
  public response_data_project: any;
  public response: any;
  public builders: any;
  public banks: any;
  public typeProjects: any;
  public stateProjects: any;
  public filterType: any;
  public filterCity: any;
  public filterZone: any;
  public filterSector: any;
  public featuresProjects: any;
  public stratumProjects: any;
  public schedulesDayProjects: any;
  public schedulesHoursProjects: any;
  public collectionProjects: any;
  public finishesTypology: any;
  public bedroomsTypology: any;
  public bathroomsTypology: any;
  public garagesTypology: any;
  public garageTypesTypology: any;
  public propertyLevelsTypology: any;
  public livingDiningRoomTypology: any;
  public featuresTypology: any;
  public propertyTypeTypology: any;
  public imageSrc: string;
  public planeSrc: string;
  public images: string[] = [];
  public imagesTypology: string[] = [];
  public featuresProjectsArray: string[] = [];
  public featuresTypologyArray: string[] = [];
  public formTypologyArray: string[] = [];
  public formProjectArray: string[] = [];
  public formTypologyEditArray: string[] = [];
  public stringQuery = '';
  public formSave = '';
  arrayOptions: string[] = [];
  optionsTypySelected: string = '';
  optionsCitySelected: string = '';
  optionsZoneSelected: string = '';
  optionsSectorSelected: string = '';
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom:number;
  address: string;
  public geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(public Service: ContentUploadService, private formBuilder: FormBuilder,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.createForm();
    this.createFormTypology();
    this.setCurrentLocation();
    /* Meétodo de Google Maps */
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    /* Método para obtener toda la info de locaciones */
    this.Service.getDataSearch().subscribe(
      (data) => (this.responseAllData = data),
      (err) => console.log(),
      () => {
        this.responseSearchData = this.responseAllData.project
        this.responseTypologyData = this.responseAllData.typology
        if (this.responseSearchData) {
          sessionStorage.removeItem('qtEmails');
          sessionStorage.removeItem('qtPhones');
          console.log(this.responseSearchData.builder);
          this.builders = this.responseSearchData.builder;
          this.banks = this.responseSearchData.financialEntity
          this.typeProjects = this.responseSearchData.projectCategory
          this.stateProjects = this.responseSearchData.currentStatus
          this.stratumProjects = this.responseSearchData.stratum
          this.featuresProjects = this.responseSearchData.features 
          this.collectionProjects = this.responseSearchData.collection 
          this.schedulesDayProjects = this.responseSearchData.attention_schedule.days
          this.schedulesHoursProjects = this.responseSearchData.attention_schedule.hours
          this.results = true;
        }
        if(this.responseTypologyData){
          this.results = false;
          this.finishesTypology = this.responseTypologyData.finishes
          this.bedroomsTypology = this.responseTypologyData.bedrooms
          this.bathroomsTypology = this.responseTypologyData.bathrooms
          this.garagesTypology = this.responseTypologyData.garages
          this.garageTypesTypology = this.responseTypologyData.garageTypes
          this.propertyLevelsTypology = this.responseTypologyData.propertyLevels
          this.livingDiningRoomTypology = this.responseTypologyData.livingDiningRoom
          this.featuresTypology = this.responseTypologyData.features
          this.propertyTypeTypology = this.responseTypologyData.propertyType
          console.log(this.garageTypesTypology);
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseSearchData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info de locaciones */
    this.Service.getDataFilterCity().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          if(this.response.facets.project_city){
            this.filterCity = this.response.facets.project_city;
          }
        }
        /* si responde correctamente */
        if (this.responseSearchData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }

  /* Obtener la locacion en coordenadas actual */
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
  }
  getAddress(latitude, longitude) {
    // console.log('lat',this.latitude,'long',this.longitude)
    this.geoCoder.geocode(
      { 'location': 
        { 
          lat: latitude, lng: longitude 
        } 
      }, (results, status) => {
      console.log(results);
      console.log(status);
      // if (status === 'OK') {
      //   if (results[0]) {
      //     this.zoom = 12;
      //     this.address = results[0].formatted_address;
      //   } else {
      //     window.alert('No results found');
      //   }
      // } else {
      //   window.alert('Geocoder failed due to: ' + status);
      // }

    });
  }
  ngAfterViewChecked() {
    if (this.results) {
      // sessionStorage.removeItem('qtEmails');   
      $('app-content-upload').foundation();
      /* eliminamos los item de email y telefono */
      // sessionStorage.removeItem('qtEmails');
      // sessionStorage.removeItem('qtPhones');
      // $('html,body').scrollTop(0);
    }
  }
  activeSelected(day){
    // $().toogg
  }
  onFilePlanesChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.planeSrc = reader.result as string;
     
        // this.myForm.patchValue({
        //   fileSource: reader.result
        // });
   
      };
   
    }
  }
  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
        // this.myForm.patchValue({
        //   fileSource: reader.result
        // });
   
      };
   
    }
  }
  onFilesChange(event) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event:any) => {
                  console.log(event.target.result);
                   this.images.push(event.target.result); 

                  //  this.myForm.patchValue({
                  //     fileSource: this.images
                  //  });
                }

                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }
  onFilesTypologyChange(event) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event:any) => {
                  console.log(event.target.result);
                   this.imagesTypology.push(event.target.result); 

                  //  this.myForm.patchValue({
                  //     fileSource: this.images
                  //  });
                }

                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }
  onFeaturesClick(type_feature,event,type) {
    if(type_feature == 'projects'){
      if (event && event !== null && type == 'add') {
        /* se agrega al array featuresProjectsArray */
        this.featuresProjectsArray.push(event); 
        /* Se quita del array featuresProjects */
        const index = this.featuresProjects.indexOf(event);
        this.featuresProjects.splice(index, 1);
      }else if (event && event !== null && type == 'remove') {
        /* remover el item del array features */
        const index = this.featuresProjectsArray.indexOf(event);
        this.featuresProjectsArray.splice(index, 1);
        /* se agrega al array featuresProjects */
        this.featuresProjects.push(event); 
        // this.featuresProjects.sort(function (a, b) {
        //   return a.length - b.length;
        // });
        // console.log(this.featuresProjects);
      }
    }else if(type_feature == 'typology'){
      if (event && event !== null && type == 'add') {
        /* se agrega al array featuresProjectsArray */
        this.featuresTypologyArray.push(event); 
        /* Se quita del array featuresProjects */
        const index = this.featuresTypology.indexOf(event);
        this.featuresTypology.splice(index, 1);
      }else if (event && event !== null && type == 'remove') {
        /* remover el item del array features */
        const index = this.featuresTypologyArray.indexOf(event);
        this.featuresTypologyArray.splice(index, 1);
        /* se agrega al array featuresTypology */
        this.featuresTypology.push(event); 
        // this.featuresTypology.sort(function (a, b) {
        //   return a.length - b.length;
        // });
        // console.log(this.featuresTypology);
      }
    }
  }
  onSubmit(value) {
    value.project_characteristics = this.featuresProjectsArray;
    value.logo_project = this.imageSrc;
    value.images_project = this.images;
    console.log(value);
    this.formProjectArray.push(value);
  }
  onSubmitTypology(value){    
    console.log(value);
    value.images_property = this.imagesTypology;
    value.maps = this.planeSrc;
    value.property_characteristics = this.featuresTypologyArray;
    this.featuresTypologyArray = [];
    this.imagesTypology = [];
    this.planeSrc = "";
    this.formTypologyArray.push(value); 
    console.log('se almaceno en el array de las tipologias',this.formTypologyArray);
    this.createFormTypology();
  }
  saveTemporary(projectValue,typologysValue){
    if(this.formProjectArray && this.formProjectArray.length > 0){
      sessionStorage.setItem("projectInfo", JSON.stringify(this.formProjectArray));
    }else{
      sessionStorage.setItem("projectInfo", JSON.stringify(projectValue));
    }
    if(this.formTypologyArray && this.formTypologyArray.length > 0){
      this.formTypologyArray.push(typologysValue); 
      sessionStorage.setItem("projectInfo", JSON.stringify(this.formTypologyArray));
    }else{
      sessionStorage.setItem("projectInfo", JSON.stringify(typologysValue));
    }
  }
  sendAllInfo(){
    let payload = {
      "projectInfo": {
        "project": this.formProjectArray
      },
      "typologysInfo": {
        "typologys": this.formTypologyArray,
      }
    }
    /* eliminamos los item de email y telefono */
    sessionStorage.removeItem('qtEmails');
    sessionStorage.removeItem('qtPhones');
    this.Service.saveformData('submit', payload).subscribe(
      (data) => (this.confirm = data),
      (err) => console.log(),
      () => {
        if (this.confirm.successful) {
          $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if (this.confirm.error) {
          $('#modalAlertError').foundation('open');
        }
      }
    );
  }
  editTypology(index){ 
    /* se asigna el valor de la tipología a editar */
    this.formTypologyEditArray.push(this.formTypologyArray[index]);
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name_proyect: new FormControl(''),
      company_constructor: new FormControl(''),
      type_property: new FormControl(''),
      status_project: new FormControl(''),
      date_of_delivery: new FormControl(''),
      city: new FormControl(''),
      zone: new FormControl(''),
      sector: new FormControl(''),
      address_project: new FormControl(''),
      address_room_sales: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      stratum: new FormControl(''),
      bank: new FormControl(''),
      logo_project: new FormControl(''),
      images_project: new FormControl(''),
      url_video: new FormControl(''),
      project_characteristics: new FormControl(''),
      number_towers: new FormControl(''),
      floors_towers: new FormControl(''),
      apartments_towers: new FormControl(''),
      elevator_towers: new FormControl(''),
      characteristics_environment: new FormControl(''),
      colection: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      email2: new FormControl(''),
      email3: new FormControl(''),
      email4: new FormControl(''),
      email5: new FormControl(''),
      email6: new FormControl(''),
      email7: new FormControl(''),
      email8: new FormControl(''),
      email9: new FormControl(''),
      email10: new FormControl(''),
      phone: new FormControl(''),
      phone2: new FormControl(''),
      phone3: new FormControl(''),
      phone4: new FormControl(''),
      phone5: new FormControl(''),
      phone6: new FormControl(''),
      phone7: new FormControl(''),
      phone8: new FormControl(''),
      phone9: new FormControl(''),
      phone10: new FormControl(''),
      check_whatsapp: new FormControl(''),
      dayTimeAtention: new FormControl(''),
      hour: new FormControl(''),
      schedule: new FormControl(''),
      specification: new FormControl(''),
      contact: new FormControl(''),
    });
  }
  createFormTypology() {
    this.formTypology =  this.formBuilder.group({
      label_price: new FormControl(''),
      initial_fee: new FormControl(''),
      price_from: new FormControl(''),
      separation: new FormControl(''),
      constructed_area: new FormControl(''),
      private_area: new FormControl(''),
      type_of_property: new FormControl(''),
      finishes: new FormControl(''),
      maps: new FormControl(''),
      images_property: new FormControl(''),
      video_property: new FormControl(''),
      levels_property: new FormControl(''),
      tour: new FormControl(''),
      bedrooms: new FormControl(''),
      bathrooms: new FormControl(''),
      social_bathrooms: new FormControl(''),
      garages: new FormControl(''),
      type_garages: new FormControl(''),
      dining_room: new FormControl(''),
      property_characteristics: new FormControl(''),
      balcony_area: new FormControl(''),
      immediate_delivery: new FormControl(''),
      additional_comments: new FormControl(''),
      typology: new FormControl(''),
    });
  }
  changeStepWizard(idStep) {
    console.log('entre');
    for (let index = 0; index <= 5; index++) {
      if (idStep == index) {
        $('#upload' + index).removeAttr('style');
        // console.log(index + '-muestro este item ');
      } else {
        // console.log(index + '-oculto este item ');
        $('#upload' + index).css('display', 'none');
      }
    }
  }
  addEmailsOrPhone(type){
    if(type === 'email'){
      var qtyEmails = sessionStorage['qtEmails']?sessionStorage.getItem("qtEmails"):1;
      qtyEmails = Number(qtyEmails) + Number(1);
      sessionStorage.setItem('qtEmails',String(qtyEmails));
      $("#email"+qtyEmails).removeClass('hide')
    }else if(type === 'phone'){
      console.log('generar telefonos')
      var qtyPhones = sessionStorage['qtPhones']?sessionStorage.getItem("qtPhones"):1;
      qtyPhones = Number(qtyPhones) + Number(1);
      sessionStorage.setItem('qtPhones',String(qtyPhones));
      $("#celular"+qtyPhones).removeClass('hide')
    }
  }
  updateControls(addressComponents) {
      console.log(addressComponents);
  }
  change(type,value) {
    console.log(type);
    if(type === 'city' || type === 'zone' || type === 'sector' ){
      this.stringQuery = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione' || value[key] && value[key] !== 'Deseas ser contactado'){
          console.log(value[key]);
          this.stringQuery = value[key];
        }
      },this);
      console.log(this.stringQuery);
  
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
          if(this.response.facets.project_city){
            this.optionsCitySelected = '';
            for(let optionCity of this.response.facets.project_city){
              if(optionCity.values.active == 'true'){
                this.optionsCitySelected = optionCity.url;
              }
            }
            this.filterCity = this.response.facets.project_city;
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
  }
  decreaseValue(value) {
    if(value == 1){
      var val = $('#bedroom').val();
      val = Number(val)-Number(1);
      if(val < 0){
        val = 0;
      };
      $('#bedroom').val(val);
    }else if(value == 2){
      var val = $('#bathroom').val();
      val = Number(val)-Number(1);
      if(val < 0){
        val = 0;
      };
      $('#bathroom').val(val);
    }else if(value == 3){
      var val = $('#garage').val();
      val = Number(val)-Number(1)
      if(val < 0){
        val = 0;
      };
      $('#garage').val(val);
    }else if(value == 4){
      var val = $('#garage').val();
      val = Number(val)-Number(1)
      if(val < 0){
        val = 0;
      };
      $('#levels_property').val(val);
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
    }else if(value == 4){
      var val = $('#garage').val();
      val = Number(val)+Number(1)
      $('#levels_property').val(val);
    }
  }
}
