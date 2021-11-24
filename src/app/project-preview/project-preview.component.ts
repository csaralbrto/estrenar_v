import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryItem, ThumbnailsPosition, ImageSize, ImageItem } from 'ng-gallery';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl, SafeUrl, Meta} from '@angular/platform-browser';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.scss']
})
export class ProjectPreviewComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public newResponse: any;
  public responseProperties: any;
  public responseSubmit: any;
  public responseAvailableAreas: any;
  public projectsAvailableAreas: any;
  public form: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;
  public form4: FormGroup;
  public title: any;
  public results = false;
  public salario_minimo = 877803;
  public prestamo_endeudamiento: any;
  public vivienda_endeudamiento: any;
  public total_vivienda: any;
  public smmlv_vivienda: any;
  public subsidio_vivienda: any;
  public monto_prestamo_credito: any;
  public ingresos_mensuales_min_credito: any;
  public plazo_meses_credito: any;
  public tasa_de_interes_credito: any;
  public cuota_inicial_vivienda_credito: any;
  public cuota_inicial_porcentaje_vivienda_credito: any;
  public cuota_mensual_credito: any;
  public cuotasMensuales: any[] = [];
  public valorInmuebleCuota: any;
  public valorCuotaInicial: any;
  public valorAhorroCuota: any;
  public saldoDiferirCuota: any;
  public operacion:any;
  public valoresPares:any;
  public placesGoogleHospital: any ;
  public placesGoogleRestaurant: any ;
  public placesGoogleBank: any ;
  public placesGoogleUniversity: any ;
  public placesGoogleMall: any ;
  public placesGooglepark: any ;
  public placesGooglesupermarket: any ;
  public placesGooglechurch: any ;
  public placesGoogletransit_station: any ;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService,
    public gallery: Gallery,
    public galleryPlano: Gallery,
    ) { }
    dataPath = environment.endpoint;
    dataSrcImg = environment.endpointTestingApiUrl
    itemImg: GalleryItem[];
    itemImgPlano: GalleryItem[];
    cadena = '';
    largo = '';
    video_url = '';
    tour_url = '';
    public galeria;
    public caracteristicas;
    public caracteristicasProject;
    public othersAreas;
    public propertiesSimilars;
    public confirm: any;
    public typologyUuid: any;
    public idProject: any;
    public priceProject: any;
    public cityProject: any;
    public urlTour: any;
    public safeURLVideo: any;
    public projectPreview: any
    public Hospital_visible = false;
    public Restaurant_visible = false;
    public Bank_visible = false;
    public University_visible = false;
    public Mall_visible = false;
    public park_visible = false;
    public supermarket_visible = false;
    public church_visible = false;
    public transit_station_visible = false;
    public icon_hospital = './assets/images/markets/pin-hospital.svg';
    public icon_bank = './assets/images/markets/pin-banco.svg';
    public icon_mall = './assets/images/markets/pin-cc.svg';
    public icon_restaurant = './assets/images/markets/pin-restaurant.svg';
    public icon_university = './assets/images/markets/pin-universidad.svg';
    public icon_transporte = './assets/images/markets/pinazul-claro.svg';
    public icon_park = './assets/images/markets/pin-azulo.svg';
    public icon_supermarket = './assets/images/markets/pinazul-claro.svg';
    public icon_church = './assets/images/markets/pin-azulo.svg';
    latitude: number;
    longitude: number;
    public coor_latitude: any;
    public coor_longitude: any;
    public blueprintProyect: any;
    public galeriaArrayPlano: any[] = [];
    public blueprint: any;
    zoom:number;
    items: any[] = [];
    itemsPlano: any[] = [];
    public safeVideoURLVideo: any;
    public videoUrl: any;

    public maps_url;
    url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {
    this.startSpinner();
    this.createForm();
    this.createFormDates();
    this.createFormSimuladores();
    this.createFormModal();
    //Fecha
    this.items = this.getDates(
      Date.now()
    );

    if (sessionStorage['previewProject']) {
      var project_preview = JSON.parse(sessionStorage.getItem("previewProject"));
      this.projectPreview = project_preview[0];
      console.log(this.projectPreview)
      this.response = this.projectPreview;
      this.galeria = this.response.images_project;
      // const latong = this.response.latitude_project + ',' + this.response.longitude_project;
      this.coor_latitude = this.response.latitude_project;
      this.coor_longitude = this.response.longitude_project;
      this.response.marketIcon =
      {
        url: './assets/images/markets/pin-verde.svg',
        scaledSize: {
            width: 60,
            height: 60
        }
      }
      if(this.response.url_tour !== null && this.response.url_tour !== undefined){
        this.tour_url = "tour";
        this.safeURLVideo = this.response.url_tour;
        this.urlTour = this.sanitizer.bypassSecurityTrustResourceUrl(this.safeURLVideo);
        $('#tour_tab').attr('data-tabs-target', 'tour');
        $('#tour_tab').attr('href', '#tour');
        // console.log(this.urlTour);
      }else{
        this.tour_url =  "images";
        $('#li_tour').addClass('disabled-li');
        $('#tour_tab').addClass('disabled-a');
        $('#tour_tab').attr('data-tabs-target', 'images');
        $('#tour_tab').attr('href', '#images');
      }
      if(this.response.url_video !== null){
        this.safeVideoURLVideo = this.response.url_video;
        var var_video_url = this.safeVideoURLVideo.replace('https://youtu.be/', "https://www.youtube.com/embed/");
        // console.log("mirar video "+ var_video_url);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(var_video_url);
        console.log(this.videoUrl);
        this.video_url = "video";
        $('#video_tab').attr('data-tabs-target', 'video');
        $('#video_tab').attr('href', '#video');
      }else{
        this.video_url = "images";
        $('#li_video').addClass('disabled-li');
        $('#video_tab').addClass('disabled-a');
        $('#video_tab').attr('data-tabs-target', 'images');
        $('#video_tab').attr('href', '#images');
      }
      if(this.response.blueprint !== undefined){
        this.blueprintProyect = this.response.blueprint;
        this.blueprint = this.blueprintProyect[0].uri.url;
        /* Asignación de imagenes al Lightbox */
        let imageGalleryArrayPlano = [];
        for (let JsonGalleryPlano of this.blueprintProyect){
          imageGalleryArrayPlano.push({srcUrl: this.url_img_path + JsonGalleryPlano.uri.url, previewUrl: this.url_img_path + JsonGalleryPlano.uri.url})
          this.galeriaArrayPlano.push(JsonGalleryPlano);
        }
        /*   1. cear Galeria  con los items */
        this.itemImgPlano = imageGalleryArrayPlano.map(itemPlano =>
          new ImageItem({ src: itemPlano.srcUrl, thumb: itemPlano.previewUrl })
        );
        this.basicLightboxPlano();
        this.withCustomGalleryConfigPlano();
      }
      this.results = true;
      $('app-project-preview').foundation();
      this.stopSpinner();
      this.setCurrentLocation();
    }
  }  //fecha
  getDates(startDate: any) {
    let dateArray = [];
    let currentDate = moment(startDate);
      dateArray.push(moment(currentDate).format("YYYY-MMM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    return dateArray;
  }
  // Cambiar el mes fecha
  changeMonth(event) {
    console.log(event.target.value);
    this.items = this.getDates(
      event.target.value
    );
    console.log(this.items);
  }
  // fecha
  returnWeekDay(item: any) {
    return new Date(item).toLocaleDateString("default", { weekday: "long" });
  }
  returnmonth(item: any) {
    return new Date(item).toLocaleDateString("default", { month: "long" });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = this.coor_latitude;
        this.longitude = this.coor_longitude;
        this.zoom = 15;
        // this.mapTypeId = 'roadmap';
      });

      this.GooglePlaces();
    }
  }
  GooglePlaces(){

    let map;//: google.maps.Map;
    let service;//: google.maps.places.PlacesService;
    let infowindow;//: google.maps.InfoWindow;
    const place = new google.maps.LatLng(this.coor_latitude,this.coor_longitude);

    //infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: place,
      zoom: 15,
    });
    let types_places = [
      'hospital',
      'shopping_mall',
      'restaurant',
      'bank',
      'school',
      'park',
      'supermarket',
      'church',
      'transit_station'
    ]
    for (let places of types_places) {
        var request = {
          location: place,
          radius: '1000',
          type: [places]
        };

        service = new google.maps.places.PlacesService(map);

        service.nearbySearch(
          request,
          (
            results: google.maps.places.PlaceResult[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              // console.log(results);
              if(places == 'hospital'){
                this.placesGoogleHospital = results;
              }else if(places == 'shopping_mall'){
                this.placesGoogleMall = results;
              }else if(places == 'restaurant'){
                this.placesGoogleRestaurant = results
              }else if(places == 'bank'){
                this.placesGoogleBank = results;
              }else if(places == 'school'){
                this.placesGoogleUniversity = results;
              }else if(places == 'park'){
                this.placesGooglepark = results;
              }else if(places == 'supermarket'){
                this.placesGooglesupermarket = results;
              }else if(places == 'church'){
                this.placesGooglechurch = results;
              }else if(places == 'transit_station'){
                this.placesGoogletransit_station = results;
              }
            }
          }
        );
        this.stopSpinner();
    }

  }
  changePlaces(value){
    // console.log('entre abrir');
    this.startSpinner();
    this.Hospital_visible = false;
    this.University_visible = false;
    this.Mall_visible = false;
    this.Bank_visible = false;
    this.Restaurant_visible = false;
    this.park_visible = false
    this.supermarket_visible = false
    this.church_visible = false
    this.transit_station_visible = false

    if(value == "hospital"){
      this.Hospital_visible = true;
    }else if(value == 'university'){
      this.University_visible = true;
    }else if(value == 'mall'){
      this.Mall_visible = true;
    }else if(value == 'banks'){
      this.Bank_visible = true;
    }else if(value == 'school'){
      this.Restaurant_visible = true;
    }else if(value == 'park'){
      this.park_visible = true;
    }else if(value == 'supermarket'){
      this.supermarket_visible = true;
    }else if(value == 'church'){
      this.church_visible = true;
    }else if(value == 'transit_station'){
      this.transit_station_visible = true;
    }
    setTimeout(() => { this.stopSpinner() }, 2500);
  }
  basicLightboxPlano() {
    this.galleryPlano.ref().load(this.itemImgPlano);
  }
  withCustomGalleryConfigPlano() {
    const lightboxGalleryRef1 = this.galleryPlano.ref('anotherLightbox1');
    lightboxGalleryRef1.load(this.itemImgPlano);
  }
  basicLightboxExample() {
    this.gallery.ref().load(this.itemImg);
  }
  withCustomGalleryConfig() {
    const lightboxGalleryRef = this.gallery.ref('anotherLightbox');
    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top
    });
    lightboxGalleryRef.load(this.itemImg);
  }
  changeJournal(value){
    if(value == 'morning'){
      $('#journal-late').addClass('hide');
      $('#journal-morning').removeClass('hide');
    }else{
      $('#journal-late').removeClass('hide');
      $('#journal-morning').addClass('hide');
      $('#08am').removeClass('bton-active');
      $('#09am').removeClass('bton-active');
      $('#10am').removeClass('bton-active');
      $('#11am').removeClass('bton-active');
    }
  }
  selectJournal(value){
    if(value == "08"){
      $('#08am').addClass('bton-active');
      $('#09am').removeClass('bton-active');
      $('#10am').removeClass('bton-active');
      $('#11am').removeClass('bton-active');
    }else if(value == "09"){
      $('#08am').removeClass('bton-active');
      $('#09am').addClass('bton-active');
      $('#10am').removeClass('bton-active');
      $('#11am').removeClass('bton-active');
    }else if(value == "10"){
      $('#08am').removeClass('bton-active');
      $('#09am').removeClass('bton-active');
      $('#10am').addClass('bton-active');
      $('#11am').removeClass('bton-active');
    }else if(value == "11"){
      $('#08am').removeClass('bton-active');
      $('#09am').removeClass('bton-active');
      $('#10am').removeClass('bton-active');
      $('#11am').addClass('bton-active');
    }else if(value == "02"){
      $('#02pm').addClass('bton-active');
      $('#03pm').removeClass('bton-active');
      $('#04pm').removeClass('bton-active');
      $('#05pm').removeClass('bton-active');
    }else if(value == "03"){
      $('#02pm').removeClass('bton-active');
      $('#03pm').addClass('bton-active');
      $('#04pm').removeClass('bton-active');
      $('#05pm').removeClass('bton-active');
    }else if(value == "04"){
      $('#02pm').removeClass('bton-active');
      $('#03pm').removeClass('bton-active');
      $('#04pm').addClass('bton-active');
      $('#05pm').removeClass('bton-active');
    }else if(value == "05"){
      $('#02pm').removeClass('bton-active');
      $('#03pm').removeClass('bton-active');
      $('#04pm').removeClass('bton-active');
      $('#05pm').addClass('bton-active');
    }
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-preview').foundation();
      if ($('.slider-project-img').length) {
        $('.slider-project-img').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-properties-project').length) {
        $('.slider-properties-project').not('.slick-initialized').slick({
          // dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
    }
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
  createForm() {
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
  createFormSimuladores() {
    this.form3 =  this.formBuilder.group({
      ingresos_mensuales_endudamiento: new FormControl(''),
      prestamo_endudamiento: new FormControl(''),
      vivienda_endudamiento: new FormControl(''),
      ingresos_mensuales_vivienda: new FormControl(''),
      ingresos_mensuales_persona_vivienda: new FormControl(''),
      ingresos_totales_vivienda: new FormControl(''),
      ahorros_cuota: new FormControl(''),
      primas_cuota: new FormControl(''),
      valor_inmueble_cuota: new FormControl(''),
      tipo_credito_cuota: new FormControl(''),
      fecha_cuota: new FormControl(''),
      valor_vivienda_credito: new FormControl(''),
      plazo_credito: new FormControl(''),
      tipo_credito_credito: new FormControl(''),
    });
  }
  createFormDates() {
    this.form2 =  this.formBuilder.group({
      dateAgenda: new FormControl(''),
      journalOption: new FormControl('manana'),
      schedule: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      term: new FormControl(''),
      contact: new FormControl('Deseas ser contactado'),
    });
  }
  createFormModal() {
    this.form4 =  this.formBuilder.group({
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
        "scheduling": {
            "dateTime": date,
            "type": "Virtual"
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
            "computedCopy": true
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
            "typology": 123,
            "survey": [
                {
                    "Buscas vivienda para": values.typeSearch
                },
                {
                    "Deseas ser contactado vía": values.contact
                }
            ]
        },
        "main": {
            "privacyNotice": 5323,
            "category": "Contacto proyecto"
        }
    }
    console.log(payload);
      // this.Service.getFormService( payload )
      // .subscribe(
      //   data =>(this.responseSubmit = data),
      //   err => console.log(),
      //   () => {
      //     if(this.responseSubmit.id){
      //       $('#exampleModal1').foundation('open');
      //       this.form.reset();
      //     }
      //     if(!this.responseSubmit.id){
      //       // $('#modalAlertError').foundation('open');
      //     }
      //   }
      // );
    }
  }
  onSubmitDates(values) {
    /* Se recibe los valores del formulario de Citas */
    values.type_submit = 'date_form';
    // this.Service.getFormService( values )
    // .subscribe(
    //   data => this.confirm = data,
    //   err => console.log(),
    //   () => {
    //     if(this.confirm){
    //       // $('#modalAlertSuccessful').foundation('open');
    //       console.log('Respondió '+this.confirm);
    //       this.form.reset();
    //     }
    //     if(this.confirm.error){
    //       // $('#modalAlertError').foundation('open');
    //     }
    //   }
    // );
  }
  onSubmitModal(values) {
    console.log(values);
    var error = false;
    if(values.name == null || values.name == ""){
      $('#spanNameModal').removeClass('hide');
      error = true;
    }else{
      $('#spanNameModal').addClass('hide');
      error = false;
    }
    if(values.lastname == null || values.lastname == ""){
      $('#spannLastNameModal').removeClass('hide');
      error = true;
    }else{
      $('#spannLastNameModal').addClass('hide');
      error = false;
    }
    if(values.phone == null || values.phone == ""){
      $('#spanPhoneModal').removeClass('hide');
      error = true;
    }else{
      $('#spanPhoneModal').addClass('hide');
      error = false;
    }
    if(values.email == null || values.email == ""){
      $('#spanEmailModal').removeClass('hide');
      error = true;
    }else{
      $('#spanEmailModal').addClass('hide');
      error = false;
    }
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContactModal').removeClass('hide');
      error = true;
    }else{
      $('#spanContactModal').addClass('hide');
      error = false;
    }
    if(values.term == null || values.term == ""){
      $('#spanTermModal').removeClass('hide');
      error = true;
    }else{
      $('#spanTermModal').addClass('hide');
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
      // this.Service.getFormService( payload )
      // .subscribe(
      //   data =>(this.responseSubmit = data),
      //   err => console.log(),
      //   () => {
      //     if(this.responseSubmit.id){
      //       $('#exampleModal1').foundation('open');
      //       this.form.reset();
      //     }
      //     if(!this.responseSubmit.id){
      //       // $('#modalAlertError').foundation('open');
      //     }
      //   }
      // );
    }
  }
  showHideTab(value){
    if(value == 1){
      $('#showMap').attr('aria-selected', 'true');
      $('#showStreet').attr('aria-selected', 'false');
      $('#showPlane').attr('aria-selected', 'false');
      $('#googleMaps').removeClass("hide");
      $('#googleStreet').addClass("visibi-hide");
      $('#planes').addClass("visibi-hide");
      $('#planes').css('height','14px');
    }else if(value == 3){
      $('#showStreet').attr('aria-selected', 'true');
      $('#showMap').attr('aria-selected', 'false');
      $('#showPlane').attr('aria-selected', 'false');
      $('#googleMaps').addClass("hide");
      $('#googleStreet').removeClass("visibi-hide");
      $('#planes').addClass("visibi-hide");
      $('#planes').css('height','14px');
    }else if(value == 2){
      $('#showStreet').attr('aria-selected', 'false');
      $('#showMap').attr('aria-selected', 'false');
      $('#showPlane').attr('aria-selected', 'true');
      $('#planes').removeClass("visibi-hide");
      $('#planes').css('height','auto');
      $('#googleMaps').addClass("hide");
      $('#googleStreet').addClass("visibi-hide");
    }
  }

}
