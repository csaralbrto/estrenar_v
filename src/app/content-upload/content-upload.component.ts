import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  latitude_input: number;
  longitude_input: number;
  zoom:number;
  address_sales_room: string;
  address_project: string;
  address_office: string;
  public geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(public Service: ContentUploadService, private formBuilder: FormBuilder,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {
    let user_role = sessionStorage['role']?sessionStorage.getItem("role"):null;
    // if(user_role === null || user_role !== '1'){
    //   this.router.navigate(['/']);
    // }
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
  /* Evento al mover el pin en el mapa */
  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
  }
  /* Evento para obtener la dirección del pin en el mapa */
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { 'location':
        {
          lat: latitude, lng: longitude
        }
      }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          var type_addres = $("input[name='address_input']:checked").val();
          console.log(type_addres);
          if(type_addres == "sales_room"){
            this.address_sales_room = results[0].formatted_address;
          }else if(type_addres == "project"){
            this.address_project = results[0].formatted_address;
          }
          this.latitude = latitude;
          this.longitude = longitude;
        }
      }

    });
  }
  /* Evento para obtener las coordenadas dependiendo de la dirección */

  changeAddress() {
    var type_addres = $("input[name='address_input']:checked").val();
    let AdressFromInput = "";
    if(type_addres == "sales_room"){
      AdressFromInput = $("input[name='address_room_sales']").val();
    }else if(type_addres == "project"){
      AdressFromInput = $("input[name='address_project']").val();
    }
    this.geoCoder.geocode(
      { 'address':
        AdressFromInput
      }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0])
          this.latitude = results[0].geometry.location.lat();
          this.longitude = results[0].geometry.location.lng();
        }
      }
    });
  }
  changeCoordenates(lat,lng){
    this.latitude = lat;
    this.longitude = lng;
  }
  /* Evento para mover el pin del mapa dependiendo de las coordenadas ingresadas */
  changeLatitude(){
     this.latitude_input = $("input[name='latitude_project']").val();
     this.longitude_input = $("input[name='longitude_project']").val();
     this.getAddress(Number(this.latitude_input), Number(this.longitude_input));
  }
  /* Evento para mover el pin del mapa dependiendo de las coordenadas ingresadas */
  changeLongitude(){
     this.latitude_input = $("input[name='latitude_project']").val();
     this.longitude_input = $("input[name='longitude_project']").val();
     this.getAddress(Number(this.latitude_input), Number(this.longitude_input));
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
    let idStep = 5;
    let error_step4 = false;
    let error_name = 0;
      if($('#name').val() == null || $('#name').val() == ""){
        $('#spanName').removeClass('hide');
        error_name = 1;
        error_step4 = true;
      }else{
        $('#spanName').addClass('hide');
        error_name = 0;
        error_step4 = false;
      }
      let error_phone = 0;
      if($('#phone').val() == null || $('#phone').val() == ""){
        $('#spanPhone').removeClass('hide');
        error_phone = 1;
        error_step4 = true;
      }else{
        $('#spanPhone').addClass('hide');
        error_phone = 0;
        error_step4 = false;
      }
      let error_email = 0;
      if($('#email').val() == null || $('#email').val() == ""){
        $('#spanEmail').removeClass('hide');
        error_email = 1;
        error_step4 = true;
      }else{
        $('#spanEmail').addClass('hide');
        error_email = 0;
        error_step4 = false;
      }
      let error_schedule1 = 0
      if($('#schedule_week').val() == null || $('#schedule_week').val() == ""){
        $('#spanSchedule1').removeClass('hide');
        error_schedule1 = 1;
        error_step4 = true;
      }else{
        $('#spanSchedule1').addClass('hide');
        error_schedule1 = 0;
        error_step4 = false;
      }
      let error_schedule2 = 0
      if($('#schedule_weekend').val() == null || $('#schedule_weekend').val() == ""){
        $('#spanSchedule2').removeClass('hide');
        error_schedule2 = 1;
        error_step4 = true;
      }else{
        $('#spanSchedule2').addClass('hide');
        error_schedule2 = 0;
        error_step4 = false;
      }
      if(error_name == 1 || error_phone == 1 || error_email == 1 || error_schedule1 == 1 || error_schedule2 == 1){
        error_step4 = true
      }
    if(!error_step4){
      value.project_characteristics = this.featuresProjectsArray;
      value.logo_project = this.imageSrc;
      value.images_project = this.images;
      console.log(value);
      this.formProjectArray.push(value);
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
  }
  onSubmitTypology(value){
    let error_typology = false
    let error_label_price
      if($('#label_price').val() == null || $('#label_price').val() == ""){
        $('#spanPriceLabel').focus();
        $('#spanPriceLabel').removeClass('hide');
        error_label_price = 1;
        error_typology = true;
      }else{
        $('#spanPriceLabel').addClass('hide');
        error_label_price = 0;
        error_typology = false;
      }
      let error_price_from
      if($('#price_from').val() == null || $('#price_from').val() == ""){
        $('#spanPriceFrom').focus();
        $('#spanPriceFrom').removeClass('hide');
        error_price_from = 1;
        error_typology = true;
      }else{
        $('#spanPriceFrom').addClass('hide');
        error_price_from = 0;
        error_typology = false;
      }
      let error_initial_fee
      if($('#initial_fee').val() == null || $('#initial_fee').val() == ""){
        $('#spanFee').focus();
        $('#spanFee').removeClass('hide');
        error_initial_fee = 1;
        error_typology = true;
      }else{
        $('#spanFee').addClass('hide');
        error_initial_fee = 0;
        error_typology = false;
      }
      let error_separation
      if($('#separation').val() == null || $('#separation').val() == ""){
        $('#spanSeparation').focus();
        $('#spanSeparation').removeClass('hide');
        error_separation = 1;
        error_typology = true;
      }else{
        $('#spanSeparation').addClass('hide');
        error_separation = 0;
        error_typology = false;
      }
      let error_constructed_area
      if($('#constructed_area').val() == null || $('#constructed_area').val() == ""){
        $('#spanArea').focus();
        $('#spanArea').removeClass('hide');
        error_constructed_area = 1;
        error_typology = true;
      }else{
        $('#spanArea').addClass('hide');
        error_constructed_area = 0;
        error_typology = false;
      }
      let error_private_area
      if($('#private_area').val() == null || $('#private_area').val() == ""){
        $('#spanPrivate').focus();
        $('#spanPrivate').removeClass('hide');
        error_private_area = 1;
        error_typology = true;
      }else{
        $('#spanPrivate').addClass('hide');
        error_private_area = 0;
        error_typology = false;
      }
      let error_type_of_property
      if($('#type_of_property').val() == null || $('#type_of_property').val() == ""){
        $('#spanTypeProperty').focus();
        $('#spanTypeProperty').removeClass('hide');
        error_type_of_property = 1;
        error_typology = true;
      }else{
        $('#spanTypeProperty').addClass('hide');
        error_type_of_property = 0;
        error_typology = false;
      }
      let error_finishes
      if($('#finishes').val() == null || $('#finishes').val() == ""){
        $('#spanfinishes').focus();
        $('#spanfinishes').removeClass('hide');
        error_finishes = 1;
        error_typology = true;
      }else{
        $('#spanfinishes').addClass('hide');
        error_finishes = 0;
        error_typology = false;
      }
      let error_planeSrc
      if(this.planeSrc == null || this.planeSrc == ""){
        $('#spanmaps').focus();
        $('#spanmaps').removeClass('hide');
        error_planeSrc = 1;
        error_typology = true;
      }else{
        $('#spanmaps').addClass('hide');
        error_planeSrc = 0;
        error_typology = false;
      }
      let error_imagesTypology
      if(!(this.imagesTypology.length > 0)){
        $('#spanimages_property').focus();
        $('#spanimages_property').removeClass('hide');
        error_imagesTypology = 1;
        error_typology = true;
      }else{
        $('#spanimages_property').addClass('hide');
        error_imagesTypology = 0;
        error_typology = false;
      }
      let error_video_property
      if($('#video_property').val() == null || $('#video_property').val() == ""){
        $('#spanvideo_property').focus();
        $('#spanvideo_property').removeClass('hide');
        error_video_property = 1;
        error_typology = true;
      }else{
        $('#spanvideo_property').addClass('hide');
        error_video_property = 0;
        error_typology = false;
      }
      let error_balcon_area
      if($('#balcon_area').val() == null || $('#balcon_area').val() == ""){
        $('#spanvideo_property').focus();
        $('#spanvideo_property').removeClass('hide');
        error_balcon_area = 1;
        error_typology = true;
      }else{
        $('#spanvideo_property').addClass('hide');
        error_balcon_area = 0;
        error_typology = false;
      }
      let error_featuresTypologyArray
      if(!(this.featuresTypologyArray.length > 0)){
        $('#spanFeature').focus();
        $('#spanFeature').removeClass('hide');
        error_featuresTypologyArray = 1;
        error_typology = true;
      }else{
        $('#spanFeature').addClass('hide');
        error_featuresTypologyArray = 0;
        error_typology = false;
      }
      if(error_label_price == 1 || error_price_from == 1 || error_initial_fee == 1 || error_separation == 1 || error_constructed_area == 1 || error_private_area == 1 || error_type_of_property == 1 || error_finishes == 1 || error_planeSrc == 1 || error_imagesTypology == 1 || error_video_property == 1 || error_balcon_area == 1 || error_featuresTypologyArray == 1 ){
        error_typology = true;
      }
    if(!error_typology){
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
      latitude_project: new FormControl(''),
      longitude_project: new FormControl(''),
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
      schedule_week: new FormControl(''),
      schedule_weekend: new FormControl(''),
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
  changeStepWizard(idStep,currentStep) {
    var error = false;
    if(currentStep == 1){
      let error_builder = 0;
      if($('#builder').val() == null || $('#builder').val() == ""){
        $('#spanBuilder').focus();
        $('#spanBuilder').removeClass('hide');
        error_builder = 1;
        error = true;
      }else{
        $('#spanBuilder').addClass('hide');
        error_builder = 0;
        error = false;
      }
      let error_name_proyect = 0;
      if($('#name_proyect').val() == null || $('#name_proyect').val() == ""){
        $('#spanNameProject').focus();
        $('#spanNameProject').removeClass('hide');
        error_name_proyect = 1;
        error = true;
      }else{
        $('#spanNameProject').addClass('hide');
        error_name_proyect = 0;
        error = false;
      }
      // if($("#type_property").is(":checked")){
      //   $('#spanType').addClass('hide');
      //   error = false;
      // }else{
      //   $('#spanType').focus();
      //   $('#spanType').removeClass('hide');
      //   error = true;
      // }
      // if($("#status_project").is(":checked")){
      //   $('#spanState').addClass('hide');
      //   error = false;
      // }else{
      //   $('#spanState').focus();
      //   $('#spanState').removeClass('hide');
      //   error = true;
      // }
      let error_date_of_delivery = 0;
      if($('#date_of_delivery').val() == ""){
        $('#spanDate').focus();
        $('#spanDate').removeClass('hide');
        error_date_of_delivery = 1;
        error = true;
      }else{
        $('#spanDate').addClass('hide');
        error_date_of_delivery = 0;
        error = false;
      }
      let error_city = 0;
      if($('#city').val() == null || $('#city').val() == ""){
        $('#spanCity').focus();
        $('#spanCity').removeClass('hide');
        error_city = 1;
        error = true;
      }else{
        $('#spanCity').addClass('hide');
        error_city = 0;
        error = false;
      }
      let error_zone = 0;
      if($('#zone').val() == null || $('#zone').val() == ""){
        $('#spanZone').focus();
        $('#spanZone').removeClass('hide');
        error_zone = 1;
        error = true;
      }else{
        $('#spanZone').addClass('hide');
        error_zone = 0;
        error = false;
      }
      let error_sector = 0;
      if($('#sector').val() == null || $('#sector').val() == ""){
        $('#spanSector').focus();
        $('#spanSector').removeClass('hide');
        error_sector = 1;
        error = true;
      }else{
        $('#spanSector').addClass('hide');
        error_sector = 0;
        error = false;
      }
      let error_address_room_sales = 0;
      if($('#address_room_sales').val() == null || $('#address_room_sales').val() == ""){
        $('#spanSales').focus();
        $('#spanSales').removeClass('hide');
        error_address_room_sales = 1;
        error = true;
      }else{
        $('#spanSales').addClass('hide');
        error_address_room_sales = 0;
        error = false;
      }
      let error_address_project = 0;
      if($('#address_project').val() == null || $('#address_project').val() == ""){
        $('#spanProject').focus();
        $('#spanProject').removeClass('hide');
        error_address_project = 1;
        error = true;
      }else{
        $('#spanProject').addClass('hide');
        error_address_project = 0;
        error = false;
      }
      let error_stratum = 0;
      if($('#stratum').val() == null || $('#stratum').val() == ""){
        $('#spanStratum').focus();
        $('#spanStratum').removeClass('hide');
        error_stratum = 1;
        error = true;
      }else{
        $('#spanStratum').addClass('hide');
        error_stratum = 0;
        error = false;
      }
      let error_bank = 0;
      if($('#bank').val() == null || $('#bank').val() == ""){
        $('#spanBank').focus();
        $('#spanBank').removeClass('hide');
        error_bank = 1;
        error = true;
      }else{
        $('#spanBank').addClass('hide');
        error_bank = 0;
        error = false;
      }
      if(error_builder == 1 || error_name_proyect == 1 || error_date_of_delivery == 1 || error_city == 1 || error_zone == 1 || error_sector == 1 || error_address_room_sales == 1 || error_address_project == 1 || error_stratum == 1 || error_bank == 1){
        error = true;
      }
    }else if(currentStep == 2){
      let error_imageSrc = 0;
      if(this.imageSrc == null || this.imageSrc == ""){
        $('#spanimageSrc').removeClass('hide');
        error_imageSrc = 1;
        error = true;
      }else{
        $('#spanimageSrc').addClass('hide');
        error_imageSrc = 0;
        error = false;
      }
      let error_images = 0;
      if(!(this.images.length > 0)){
        $('#spanimages').removeClass('hide');
        error_images = 1;
        error = true;
      }else{
        $('#spanimages').addClass('hide');
        error_images = 0;
        error = false;
      }
      let error_url_video = 0;
      if($('#url_video').val() == null || $('#url_video').val() == ""){
        $('#spanVideo').focus();
        $('#spanVideo').removeClass('hide');
        error_url_video = 1;
        error = true;
      }else{
        $('#spanVideo').addClass('hide');
        error_url_video = 0;
        error = false;
      }
      if(error_imageSrc == 1 || error_images == 1 || error_url_video == 1){
        error = true;
      }
    }else if(currentStep == 3){
      let error_feature = 0;
      if(!(this.featuresProjectsArray.length > 0)){
        $('#spanFeature').removeClass('hide');
        error_feature = 1;
        error = true;
      }else{
        $('#spanFeature').addClass('hide');
        error_feature = 0;
        error = false;
      }
      let error_number_towers
      if($('#number_towers').val() == null || $('#number_towers').val() == ""){
        $('#spanNumberTowers').focus();
        $('#spanNumberTowers').removeClass('hide');
        error_number_towers = 1;
        error = true;
      }else{
        $('#spanNumberTowers').addClass('hide');
        error_number_towers = 0;
        error = false;
      }
      let error_floors_towers
      if($('#floors_towers').val() == null || $('#floors_towers').val() == ""){
        $('#spanFloorsTowers').focus();
        $('#spanFloorsTowers').removeClass('hide');
        error_floors_towers = 1;
        error = true;
      }else{
        $('#spanFloorsTowers').addClass('hide');
        error_floors_towers = 0;
        error = false;
      }
      let error_apartments_towers
      if($('#apartments_towers').val() == null || $('#apartments_towers').val() == ""){
        $('#spanApartmentsTowers').focus();
        $('#spanApartmentsTowers').removeClass('hide');
        error_apartments_towers = 1;
        error = true;
      }else{
        $('#spanApartmentsTowers').addClass('hide');
        error_apartments_towers = 0;
        error = false;
      }
      let error_elevator_towers
      if($('#elevator_towers').val() == null || $('#elevator_towers').val() == ""){
        $('#spanElevatorTowers').focus();
        $('#spanElevatorTowers').removeClass('hide');
        error_elevator_towers = 1;
        error = true;
      }else{
        $('#spanElevatorTowers').addClass('hide');
        error_elevator_towers = 0;
        error = false;
      }
      let error_builder = 0;
      if($('#colection').val() == null || $('#colection').val() == ""){
        $('#spanColection').focus();
        $('#spanColection').removeClass('hide');
        error_builder = 1;
        error = true;
      }else{
        $('#spanColection').addClass('hide');
        error_builder = 0;
        error = false;
      }
      if(error_feature == 1 || error_number_towers == 1 || error_floors_towers == 1 || error_apartments_towers == 1 || error_elevator_towers == 1 || error_builder == 1){
        error =  true;
     }
    }else if (currentStep == 4){
      let error_name = 0;
      if($('#name').val() == null || $('#name').val() == ""){
        $('#spanName').removeClass('hide');
        error_name = 1;
        error = true;
      }else{
        $('#spanName').addClass('hide');
        error_name = 0;
        error = false;
      }
      let error_phone = 0;
      if($('#phone').val() == null || $('#phone').val() == ""){
        $('#spanPhone').removeClass('hide');
        error_phone = 1;
        error = true;
      }else{
        $('#spanPhone').addClass('hide');
        error_phone = 0;
        error = false;
      }
      let error_email = 0;
      if($('#email').val() == null || $('#email').val() == ""){
        $('#spanEmail').removeClass('hide');
        error_email = 1;
        error = true;
      }else{
        $('#spanEmail').addClass('hide');
        error_email = 0;
        error = false;
      }
      let error_schedule1 = 0
      if($('#schedule_week').val() == null || $('#schedule_week').val() == ""){
        $('#spanSchedule1').removeClass('hide');
        error_schedule1 = 1;
        error = true;
      }else{
        $('#spanSchedule1').addClass('hide');
        error_schedule1 = 0;
        error = false;
      }
      let error_schedule2 = 0
      if($('#schedule_weekend').val() == null || $('#schedule_weekend').val() == ""){
        $('#spanSchedule2').removeClass('hide');
        error_schedule2 = 1;
        error = true;
      }else{
        $('#spanSchedule2').addClass('hide');
        error_schedule2 = 0;
        error = false;
      }
      if(error_name == 1 || error_phone == 1 || error_email == 1 || error_schedule1 == 1 || error_schedule2 == 1){
        error = true
      }
    }else if (currentStep == 5){
      console.log(this.featuresTypologyArray.length);
      let error_label_price
      if($('#label_price').val() == null || $('#label_price').val() == ""){
        $('#spanPriceLabel').focus();
        $('#spanPriceLabel').removeClass('hide');
        error_label_price = 1;
        error = true;
      }else{
        $('#spanPriceLabel').addClass('hide');
        error_label_price = 0;
        error = false;
      }
      let error_price_from
      if($('#price_from').val() == null || $('#price_from').val() == ""){
        $('#spanPriceFrom').focus();
        $('#spanPriceFrom').removeClass('hide');
        error_price_from = 1;
        error = true;
      }else{
        $('#spanPriceFrom').addClass('hide');
        error_price_from = 0;
        error = false;
      }
      let error_initial_fee
      if($('#initial_fee').val() == null || $('#initial_fee').val() == ""){
        $('#spanFee').focus();
        $('#spanFee').removeClass('hide');
        error_initial_fee = 1;
        error = true;
      }else{
        $('#spanFee').addClass('hide');
        error_initial_fee = 0;
        error = false;
      }
      let error_separation
      if($('#separation').val() == null || $('#separation').val() == ""){
        $('#spanSeparation').focus();
        $('#spanSeparation').removeClass('hide');
        error_separation = 1;
        error = true;
      }else{
        $('#spanSeparation').addClass('hide');
        error_separation = 0;
        error = false;
      }
      let error_constructed_area
      if($('#constructed_area').val() == null || $('#constructed_area').val() == ""){
        $('#spanArea').focus();
        $('#spanArea').removeClass('hide');
        error_constructed_area = 1;
        error = true;
      }else{
        $('#spanArea').addClass('hide');
        error_constructed_area = 0;
        error = false;
      }
      let error_private_area
      if($('#private_area').val() == null || $('#private_area').val() == ""){
        $('#spanPrivate').focus();
        $('#spanPrivate').removeClass('hide');
        error_private_area = 1;
        error = true;
      }else{
        $('#spanPrivate').addClass('hide');
        error_private_area = 0;
        error = false;
      }
      let error_type_of_property
      if($('#type_of_property').val() == null || $('#type_of_property').val() == ""){
        $('#spanTypeProperty').focus();
        $('#spanTypeProperty').removeClass('hide');
        error_type_of_property = 1;
        error = true;
      }else{
        $('#spanTypeProperty').addClass('hide');
        error_type_of_property = 0;
        error = false;
      }
      let error_finishes
      if($('#finishes').val() == null || $('#finishes').val() == ""){
        $('#spanfinishes').focus();
        $('#spanfinishes').removeClass('hide');
        error_finishes = 1;
        error = true;
      }else{
        $('#spanfinishes').addClass('hide');
        error_finishes = 0;
        error = false;
      }
      let error_planeSrc
      if(this.planeSrc == null || this.planeSrc == ""){
        $('#spanmaps').focus();
        $('#spanmaps').removeClass('hide');
        error_planeSrc = 1;
        error = true;
      }else{
        $('#spanmaps').addClass('hide');
        error_planeSrc = 0;
        error = false;
      }
      let error_imagesTypology
      if(!(this.imagesTypology.length > 0)){
        $('#spanimages_property').focus();
        $('#spanimages_property').removeClass('hide');
        error_imagesTypology = 1;
        error = true;
      }else{
        $('#spanimages_property').addClass('hide');
        error_imagesTypology = 0;
        error = false;
      }
      let error_video_property
      if($('#video_property').val() == null || $('#video_property').val() == ""){
        $('#spanvideo_property').focus();
        $('#spanvideo_property').removeClass('hide');
        error_video_property = 1;
        error = true;
      }else{
        $('#spanvideo_property').addClass('hide');
        error_video_property = 0;
        error = false;
      }
      let error_balcon_area
      if($('#balcon_area').val() == null || $('#balcon_area').val() == ""){
        $('#spanvideo_property').focus();
        $('#spanvideo_property').removeClass('hide');
        error_balcon_area = 1;
        error = true;
      }else{
        $('#spanvideo_property').addClass('hide');
        error_balcon_area = 0;
        error = false;
      }
      let error_featuresTypologyArray
      if(!(this.featuresTypologyArray.length > 0)){
        $('#spanFeature').focus();
        $('#spanFeature').removeClass('hide');
        error_featuresTypologyArray = 1;
        error = true;
      }else{
        $('#spanFeature').addClass('hide');
        error_featuresTypologyArray = 0;
        error = false;
      }
      if(error_label_price == 1 || error_price_from == 1 || error_initial_fee == 1 || error_separation == 1 || error_constructed_area == 1 || error_private_area == 1 || error_type_of_property == 1 || error_finishes == 1 || error_planeSrc == 1 || error_imagesTypology == 1 || error_video_property == 1 || error_balcon_area == 1 || error_featuresTypologyArray == 1 ){
        error = true;
      }
    }
    // console.log('la varieble de error esta: ',error)
    if(!error){
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
  preview(values){
    let error = this.validateForm(values);
    if(error){
      $('#modalInformation').foundation('open');
    }else{
      sessionStorage.removeItem("previewProject");
      values.project_characteristics = this.featuresProjectsArray;
      values.logo_project = this.imageSrc;
      values.images_project = this.images;
      console.log(values);
      this.formProjectArray.push(values);
      sessionStorage.setItem('previewProject',JSON.stringify(this.formProjectArray))
      window.open('/es/preview-project', '_blank');
    }
  }
  validateForm(values){
    var error = false;
      let error_builder1 = 0;
      if($('#builder').val() == null || $('#builder').val() == ""){
        $('#spanBuilder').focus();
        $('#spanBuilder').removeClass('hide');
        error_builder1 = 1;
        error = true;
      }else{
        $('#spanBuilder').addClass('hide');
        error_builder1 = 0;
        error = false;
      }
      let error_name_proyect = 0;
      if($('#name_proyect').val() == null || $('#name_proyect').val() == ""){
        $('#spanNameProject').focus();
        $('#spanNameProject').removeClass('hide');
        error_name_proyect = 1;
        error = true;
      }else{
        $('#spanNameProject').addClass('hide');
        error_name_proyect = 0;
        error = false;
      }
      // if($("#type_property").is(":checked")){
      //   $('#spanType').addClass('hide');
      //   error = false;
      // }else{
      //   $('#spanType').focus();
      //   $('#spanType').removeClass('hide');
      //   error = true;
      // }
      // if($("#status_project").is(":checked")){
      //   $('#spanState').addClass('hide');
      //   error = false;
      // }else{
      //   $('#spanState').focus();
      //   $('#spanState').removeClass('hide');
      //   error = true;
      // }
      let error_date_of_delivery = 0;
      if($('#date_of_delivery').val() == ""){
        $('#spanDate').focus();
        $('#spanDate').removeClass('hide');
        error_date_of_delivery = 1;
        error = true;
      }else{
        $('#spanDate').addClass('hide');
        error_date_of_delivery = 0;
        error = false;
      }
      let error_city = 0;
      if($('#city').val() == null || $('#city').val() == ""){
        $('#spanCity').focus();
        $('#spanCity').removeClass('hide');
        error_city = 1;
        error = true;
      }else{
        $('#spanCity').addClass('hide');
        error_city = 0;
        error = false;
      }
      let error_zone = 0;
      if($('#zone').val() == null || $('#zone').val() == ""){
        $('#spanZone').focus();
        $('#spanZone').removeClass('hide');
        error_zone = 1;
        error = true;
      }else{
        $('#spanZone').addClass('hide');
        error_zone = 0;
        error = false;
      }
      let error_sector = 0;
      if($('#sector').val() == null || $('#sector').val() == ""){
        $('#spanSector').focus();
        $('#spanSector').removeClass('hide');
        error_sector = 1;
        error = true;
      }else{
        $('#spanSector').addClass('hide');
        error_sector = 0;
        error = false;
      }
      let error_address_room_sales = 0;
      if($('#address_room_sales').val() == null || $('#address_room_sales').val() == ""){
        $('#spanSales').focus();
        $('#spanSales').removeClass('hide');
        error_address_room_sales = 1;
        error = true;
      }else{
        $('#spanSales').addClass('hide');
        error_address_room_sales = 0;
        error = false;
      }
      let error_address_project = 0;
      if($('#address_project').val() == null || $('#address_project').val() == ""){
        $('#spanProject').focus();
        $('#spanProject').removeClass('hide');
        error_address_project = 1;
        error = true;
      }else{
        $('#spanProject').addClass('hide');
        error_address_project = 0;
        error = false;
      }
      let error_stratum = 0;
      if($('#stratum').val() == null || $('#stratum').val() == ""){
        $('#spanStratum').focus();
        $('#spanStratum').removeClass('hide');
        error_stratum = 1;
        error = true;
      }else{
        $('#spanStratum').addClass('hide');
        error_stratum = 0;
        error = false;
      }
      let error_bank = 0;
      if($('#bank').val() == null || $('#bank').val() == ""){
        $('#spanBank').focus();
        $('#spanBank').removeClass('hide');
        error_bank = 1;
        error = true;
      }else{
        $('#spanBank').addClass('hide');
        error_bank = 0;
        error = false;
      }
      if(error_builder1 == 1 || error_name_proyect == 1 || error_date_of_delivery == 1 || error_city == 1 || error_zone == 1 || error_sector == 1 || error_address_room_sales == 1 || error_address_project == 1 || error_stratum == 1 || error_bank == 1){
        error = true;
      }
      let error_imageSrc = 0;
      if(this.imageSrc == null || this.imageSrc == ""){
        $('#spanimageSrc').removeClass('hide');
        error_imageSrc = 1;
        error = true;
      }else{
        $('#spanimageSrc').addClass('hide');
        error_imageSrc = 0;
        error = false;
      }
      let error_images = 0;
      if(!(this.images.length > 0)){
        $('#spanimages').removeClass('hide');
        error_images = 1;
        error = true;
      }else{
        $('#spanimages').addClass('hide');
        error_images = 0;
        error = false;
      }
      let error_url_video = 0;
      if($('#url_video').val() == null || $('#url_video').val() == ""){
        $('#spanVideo').focus();
        $('#spanVideo').removeClass('hide');
        error_url_video = 1;
        error = true;
      }else{
        $('#spanVideo').addClass('hide');
        error_url_video = 0;
        error = false;
      }
      if(error_imageSrc == 1 || error_images == 1 || error_url_video == 1){
        error = true;
      }

      let error_feature = 0;
      if(!(this.featuresProjectsArray.length > 0)){
        $('#spanFeature').removeClass('hide');
        error_feature = 1;
        error = true;
      }else{
        $('#spanFeature').addClass('hide');
        error_feature = 0;
        error = false;
      }
      let error_number_towers
      if($('#number_towers').val() == null || $('#number_towers').val() == ""){
        $('#spanNumberTowers').focus();
        $('#spanNumberTowers').removeClass('hide');
        error_number_towers = 1;
        error = true;
      }else{
        $('#spanNumberTowers').addClass('hide');
        error_number_towers = 0;
        error = false;
      }
      let error_floors_towers
      if($('#floors_towers').val() == null || $('#floors_towers').val() == ""){
        $('#spanFloorsTowers').focus();
        $('#spanFloorsTowers').removeClass('hide');
        error_floors_towers = 1;
        error = true;
      }else{
        $('#spanFloorsTowers').addClass('hide');
        error_floors_towers = 0;
        error = false;
      }
      let error_apartments_towers
      if($('#apartments_towers').val() == null || $('#apartments_towers').val() == ""){
        $('#spanApartmentsTowers').focus();
        $('#spanApartmentsTowers').removeClass('hide');
        error_apartments_towers = 1;
        error = true;
      }else{
        $('#spanApartmentsTowers').addClass('hide');
        error_apartments_towers = 0;
        error = false;
      }
      let error_elevator_towers
      if($('#elevator_towers').val() == null || $('#elevator_towers').val() == ""){
        $('#spanElevatorTowers').focus();
        $('#spanElevatorTowers').removeClass('hide');
        error_elevator_towers = 1;
        error = true;
      }else{
        $('#spanElevatorTowers').addClass('hide');
        error_elevator_towers = 0;
        error = false;
      }
      let error_builder = 0;
      if($('#colection').val() == null || $('#colection').val() == ""){
        $('#spanColection').focus();
        $('#spanColection').removeClass('hide');
        error_builder = 1;
        error = true;
      }else{
        $('#spanColection').addClass('hide');
        error_builder = 0;
        error = false;
      }
      if(error_feature == 1 || error_number_towers == 1 || error_floors_towers == 1 || error_apartments_towers == 1 || error_elevator_towers == 1 || error_builder == 1){
        error =  true;
     }
      let error_name = 0;
      if($('#name').val() == null || $('#name').val() == ""){
        $('#spanName').removeClass('hide');
        error_name = 1;
        error = true;
      }else{
        $('#spanName').addClass('hide');
        error_name = 0;
        error = false;
      }
      let error_phone = 0;
      if($('#phone').val() == null || $('#phone').val() == ""){
        $('#spanPhone').removeClass('hide');
        error_phone = 1;
        error = true;
      }else{
        $('#spanPhone').addClass('hide');
        error_phone = 0;
        error = false;
      }
      let error_email = 0;
      if($('#email').val() == null || $('#email').val() == ""){
        $('#spanEmail').removeClass('hide');
        error_email = 1;
        error = true;
      }else{
        $('#spanEmail').addClass('hide');
        error_email = 0;
        error = false;
      }
      let error_schedule1 = 0
      if($('#schedule_week').val() == null || $('#schedule_week').val() == ""){
        $('#spanSchedule1').removeClass('hide');
        error_schedule1 = 1;
        error = true;
      }else{
        $('#spanSchedule1').addClass('hide');
        error_schedule1 = 0;
        error = false;
      }
      let error_schedule2 = 0
      if($('#schedule_weekend').val() == null || $('#schedule_weekend').val() == ""){
        $('#spanSchedule2').removeClass('hide');
        error_schedule2 = 1;
        error = true;
      }else{
        $('#spanSchedule2').addClass('hide');
        error_schedule2 = 0;
        error = false;
      }
      if(error_name == 1 || error_phone == 1 || error_email == 1 || error_schedule1 == 1 || error_schedule2 == 1){
        error = true
      }
    /* Validación de tipologias */
      // console.log(this.featuresTypologyArray.length);
      // let error_label_price
      // if($('#label_price').val() == null || $('#label_price').val() == ""){
      //   $('#spanPriceLabel').focus();
      //   $('#spanPriceLabel').removeClass('hide');
      //   error_label_price = 1;
      //   error = true;
      // }else{
      //   $('#spanPriceLabel').addClass('hide');
      //   error_label_price = 0;
      //   error = false;
      // }
      // let error_price_from
      // if($('#price_from').val() == null || $('#price_from').val() == ""){
      //   $('#spanPriceFrom').focus();
      //   $('#spanPriceFrom').removeClass('hide');
      //   error_price_from = 1;
      //   error = true;
      // }else{
      //   $('#spanPriceFrom').addClass('hide');
      //   error_price_from = 0;
      //   error = false;
      // }
      // let error_initial_fee
      // if($('#initial_fee').val() == null || $('#initial_fee').val() == ""){
      //   $('#spanFee').focus();
      //   $('#spanFee').removeClass('hide');
      //   error_initial_fee = 1;
      //   error = true;
      // }else{
      //   $('#spanFee').addClass('hide');
      //   error_initial_fee = 0;
      //   error = false;
      // }
      // let error_separation
      // if($('#separation').val() == null || $('#separation').val() == ""){
      //   $('#spanSeparation').focus();
      //   $('#spanSeparation').removeClass('hide');
      //   error_separation = 1;
      //   error = true;
      // }else{
      //   $('#spanSeparation').addClass('hide');
      //   error_separation = 0;
      //   error = false;
      // }
      // let error_constructed_area
      // if($('#constructed_area').val() == null || $('#constructed_area').val() == ""){
      //   $('#spanArea').focus();
      //   $('#spanArea').removeClass('hide');
      //   error_constructed_area = 1;
      //   error = true;
      // }else{
      //   $('#spanArea').addClass('hide');
      //   error_constructed_area = 0;
      //   error = false;
      // }
      // let error_private_area
      // if($('#private_area').val() == null || $('#private_area').val() == ""){
      //   $('#spanPrivate').focus();
      //   $('#spanPrivate').removeClass('hide');
      //   error_private_area = 1;
      //   error = true;
      // }else{
      //   $('#spanPrivate').addClass('hide');
      //   error_private_area = 0;
      //   error = false;
      // }
      // let error_type_of_property
      // if($('#type_of_property').val() == null || $('#type_of_property').val() == ""){
      //   $('#spanTypeProperty').focus();
      //   $('#spanTypeProperty').removeClass('hide');
      //   error_type_of_property = 1;
      //   error = true;
      // }else{
      //   $('#spanTypeProperty').addClass('hide');
      //   error_type_of_property = 0;
      //   error = false;
      // }
      // let error_finishes
      // if($('#finishes').val() == null || $('#finishes').val() == ""){
      //   $('#spanfinishes').focus();
      //   $('#spanfinishes').removeClass('hide');
      //   error_finishes = 1;
      //   error = true;
      // }else{
      //   $('#spanfinishes').addClass('hide');
      //   error_finishes = 0;
      //   error = false;
      // }
      // let error_planeSrc
      // if(this.planeSrc == null || this.planeSrc == ""){
      //   $('#spanmaps').focus();
      //   $('#spanmaps').removeClass('hide');
      //   error_planeSrc = 1;
      //   error = true;
      // }else{
      //   $('#spanmaps').addClass('hide');
      //   error_planeSrc = 0;
      //   error = false;
      // }
      // let error_imagesTypology
      // if(!(this.imagesTypology.length > 0)){
      //   $('#spanimages_property').focus();
      //   $('#spanimages_property').removeClass('hide');
      //   error_imagesTypology = 1;
      //   error = true;
      // }else{
      //   $('#spanimages_property').addClass('hide');
      //   error_imagesTypology = 0;
      //   error = false;
      // }
      // let error_video_property
      // if($('#video_property').val() == null || $('#video_property').val() == ""){
      //   $('#spanvideo_property').focus();
      //   $('#spanvideo_property').removeClass('hide');
      //   error_video_property = 1;
      //   error = true;
      // }else{
      //   $('#spanvideo_property').addClass('hide');
      //   error_video_property = 0;
      //   error = false;
      // }
      // let error_balcon_area
      // if($('#balcon_area').val() == null || $('#balcon_area').val() == ""){
      //   $('#spanvideo_property').focus();
      //   $('#spanvideo_property').removeClass('hide');
      //   error_balcon_area = 1;
      //   error = true;
      // }else{
      //   $('#spanvideo_property').addClass('hide');
      //   error_balcon_area = 0;
      //   error = false;
      // }
      // let error_featuresTypologyArray
      // if(!(this.featuresTypologyArray.length > 0)){
      //   $('#spanFeature').focus();
      //   $('#spanFeature').removeClass('hide');
      //   error_featuresTypologyArray = 1;
      //   error = true;
      // }else{
      //   $('#spanFeature').addClass('hide');
      //   error_featuresTypologyArray = 0;
      //   error = false;
      // }
      // if(error_label_price == 1 || error_price_from == 1 || error_initial_fee == 1 || error_separation == 1 || error_constructed_area == 1 || error_private_area == 1 || error_type_of_property == 1 || error_finishes == 1 || error_planeSrc == 1 || error_imagesTypology == 1 || error_video_property == 1 || error_balcon_area == 1 || error_featuresTypologyArray == 1 ){
      //   error = true;
      // }
      return error;
  }
}
