import { map } from 'rxjs/operators';
import { Gallery, GalleryItem, ThumbnailsPosition, ImageSize, ImageItem } from 'ng-gallery';
import { Component, OnInit, AfterViewChecked, ViewChild, Input, ElementRef, ApplicationRef, PLATFORM_ID, Inject } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl, Meta} from '@angular/platform-browser';
import { ProjectDetailService } from './project-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
declare var $: any;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {
  itemImg: GalleryItem[];
  itemImgPlano: GalleryItem[];
  tags: MetaTag;
  public response: any;
  public url_project: any;
  public typeContact: any;
  public responsePlacesGoogle: any;
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
  public no_months: any;
  public operacion:any;
  public valoresPares:any;
  public mapTypeId: any;
  public newplace:any;
  public keyGoglePlace="AIzaSyDpDGfOlZAtjd1PV0UOk9a-BZ7LfHvcFFM";
  dataProjectUrl = '?include=field_typology_project.field_project_logo,field_typology_image,field_typology_project.field_project_video,field_typology_feature.field_icon_feature,field_typology_feature.parent,field_typology_feature.parent.field_icon_feature,field_typology_project.field_project_location,field_typology_project.field_project_builder.field_builder_logo,field_typology_project.field_project_location.field_location_opening_hours.parent,field_typology_project.field_project_feature.parent,field_typology_project.field_project_location.field_location_city,field_typology_blueprint,field_typology_project.field_project_feature.field_icon_feature';
  url_img_path = 'https://www.estrenarvivienda.com/';
  /* Fecha */
  items: any[] = [];
  itemsPlano: any[] = [];
  currentDate = new Date();
  currentMonth = "";
  stopDate = new Date();
  selectedItem = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ProjectDetailService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private appRef: ApplicationRef,
    public gallery: Gallery,
    public galleryPlano: Gallery,

  ) {
  }
  dataPath = environment.endpoint;
  dataSrcImg = environment.endpointTestingApiUrl
  cadena = '';
  largo = '';
  video_url = '';
  tour_url = '';
  latitude: number;
  longitude: number;
  public coor_latitude: any;
  public coor_longitude: any;
  zoom:number;
  public galeria;
  public galeriaArray: any[] = [];
  public galeriaArrayPlano: any[] = [];
  public placesGoogleHospital: any ;
  public placesGoogleRestaurant: any ;
  public placesGoogleBank: any ;
  public placesGoogleUniversity: any ;
  public placesGoogleMall: any ;
  public placesGooglepark: any ;
  public placesGooglesupermarket: any ;
  public placesGooglechurch: any ;
  public placesGoogletransit_station: any ;
  public caracteristicas;
  public caracteristicasArray: any[] = [];
  public caracteristicasProject;
  public othersAreas;
  public propertiesSimilars;
  public confirm: any;
  public typologyUuid: any;
  public idProject: any;
  public priceProject: any;
  public cityProject: any;
  public blueprintProyect: any;
  public blueprint: any;
  public urlTour: any;
  public videoUrl:any;
  public safeURLVideo: any;
  public safeVideoURLVideo: any;
  public safeVideoURL:any;
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
  public maps_url;

  ngOnInit(): void {
    $('#bots-sidebar').addClass('hide')
    this.startSpinner();
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    // this.GooglePlaces();
    this.createForm();
    this.createFormDates();
    this.createFormSimuladores();
    this.createFormModal();
    //Fecha
    this.items = this.getDates(
      Date.now()
    );
    this.title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(this.title).subscribe(
      (data) => (this.response = data.jsonapi),
      (err) => console.log(),
      () => {
        if(this.response){
          /* captamos el uuid de la tipologia */
          this.typologyUuid = this.response.individual;
          this.typologyUuid = this.typologyUuid.split('/typology/');
          this.typologyUuid = this.typologyUuid[1];
          var url = this.response.individual + this.dataProjectUrl;
          var data = "";
          console.log(url);
          fetch(url, {
          })
          .then(response => response.json())
          .then(data => {
            // console.log(data)
            this.response = data.data;
            // console.log(this.response);
            if (this.response) {
              /* si responde correctamente en la respuesta */
              this.url_project = window.location.href;
              /* format numbr */
              this.response.field_typology_price =  new Intl.NumberFormat("es-ES").format(this.response.field_typology_price)
              // console.log(this.response);
              if(this.response.metatag_normalized){
                this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
              }
              if(this.response.field_virtual_tour !== null){
                this.tour_url = "tour";
                this.safeURLVideo = this.response.field_virtual_tour.uri;
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
              if(this.response.field_typology_project.field_project_video.data !== null){
                this.safeVideoURLVideo =this.response.field_typology_project.field_project_video.field_media_oembed_video;
                var var_video_url = this.safeVideoURLVideo.replace('https://youtu.be/', "https://www.youtube.com/embed/");
                // console.log("mirar video "+ var_video_url);
                this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(var_video_url);
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
              this.cityProject = this.response.field_typology_project.field_project_location[0].field_location_city.drupal_internal__tid;
              this.priceProject = this.response.field_typology_price
              this.idProject = this.response.field_typology_project.drupal_internal__tid;
              const latong = this.response.field_typology_project.field_project_location[0].field_location_geo_data.latlon;
              this.coor_latitude = this.response.field_typology_project.field_project_location[0].field_location_geo_data.lat;
              this.coor_longitude = this.response.field_typology_project.field_project_location[0].field_location_geo_data.lon;
              // console.log("Miro imagenes1 "+this.response.typology_blueprint);

              // lightbox para planos

              console.log('aqui 1');
              if(!(this.response.field_typology_blueprint.data)){
                console.log('entre al if 2')
                if(this.response.field_typology_blueprint !== undefined){
                  console.log('entre al if 3')
                  this.blueprintProyect = this.response.field_typology_blueprint;
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
              }
              // console.log(this.coor_latitude,',',this.coor_longitude);
              this.response.marketIcon =
              {
                url: './assets/images/markets/pin-verde.svg',
                scaledSize: {
                    width: 60,
                    height: 60
                }
              }
              this.galeria = this.response.field_typology_image;
              /* Asignación de imagenes al Lightbox */
              let imageGalleryArray = [];
              for (let JsonGallery of this.galeria){
                imageGalleryArray.push({srcUrl: this.url_img_path + JsonGallery.uri.url, previewUrl: this.url_img_path + JsonGallery.uri.url})
                this.galeriaArray.push(JsonGallery);
              }
              console.log(this.galeriaArray);
              /*   1. cear Galeria  con los items */
              this.itemImg = imageGalleryArray.map(item =>
                new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
              );
              // console.log("items "+this.itemImg);

              /*  Cargar los itemd en el Lightbox */
              this.basicLightboxExample();
              /*  cargar los items en los diferentes lightbox */
              this.withCustomGalleryConfig();
              /* Fin asignación de imagenes al Lightbox */

              this.operacion= this.galeria.length;
              // console.log("mirar dato "+ this.operacion);
              if(this.operacion % 2 == 0){
                this.valoresPares = "par";
              }else{
                this.valoresPares = "impar";
              }
              // console.log("si es par "+ this.valoresPares);
              this.caracteristicas = this.response.field_typology_feature;
              console.log(this.response.field_typology_feature);
              /* caracteristicas del inmueble */
              if(this.caracteristicas.length > 0){
                for (let caracteristica_tipologia of this.caracteristicas) {
                  var name_cara;
                  var img_src;
                  if(caracteristica_tipologia.parent[0].id === 'virtual'){
                    name_cara = caracteristica_tipologia.name
                    if(caracteristica_tipologia.field_icon_feature.uri){
                      img_src = this.dataSrcImg + caracteristica_tipologia.field_icon_feature.uri.url;
                    }else{
                      img_src = '/assets/images/icon-medida.png';
                    }
                    this.caracteristicasArray.push({
                      name_only: name_cara,
                      img_src: img_src
                    })
                    caracteristica_tipologia.name_only = name_cara;
                    caracteristica_tipologia.img_src = img_src
                  }else{
                    if(caracteristica_tipologia.parent[0].name == 'Alcobas'){
                      this.response.bathrooms = caracteristica_tipologia.name;
                    }else if(caracteristica_tipologia.parent[0].name == 'Baños'){
                      this.response.bedrooms = caracteristica_tipologia.name;
                    }else if(caracteristica_tipologia.parent[0].name == 'Garajes'){
                      this.response.garages = caracteristica_tipologia.name;
                    }else{
                      name_cara = caracteristica_tipologia.parent[0].name+': '+ caracteristica_tipologia.name
                      if( caracteristica_tipologia.parent[0].field_icon_feature.uri){
                        img_src = this.dataSrcImg + caracteristica_tipologia.parent[0].field_icon_feature.uri.url;
                      }else{
                        img_src = '/assets/images/icon-medida.png';
                      }
                      this.caracteristicasArray.push({
                        name_only: name_cara,
                        img_src: img_src
                      })
                      caracteristica_tipologia.name_only = name_cara;
                      caracteristica_tipologia.img_src = img_src
                    }
                  }
                }
              }
              console.log(this.caracteristicas);
              this.caracteristicasProject = this.response.field_typology_project.field_project_feature;
              console.log(this.caracteristicasProject);
              /* caracteristicas del proyecto */
              for (let caracteristica_project of this.caracteristicasProject) {
                var name_cara;
                var img_src;
                if(caracteristica_project.parent[0].id === 'virtual'){
                  name_cara = caracteristica_project.name
                  if(caracteristica_project.field_icon_feature.uri){
                    img_src = this.dataSrcImg + caracteristica_project.field_icon_feature.uri.url;
                  }else{
                    img_src = '/assets/images/caracteristica.png';
                  }
                }else{
                  name_cara = caracteristica_project.parent[0].name+': '+ caracteristica_project.name
                  if(caracteristica_project.field_icon_feature.uri){
                    img_src = this.dataSrcImg + caracteristica_project.field_icon_feature.uri.url;
                  }else{
                    img_src = '/assets/images/caracteristica.png';
                  }
                }
                caracteristica_project.name_only = name_cara;
                caracteristica_project.img_src = img_src
              }
              let new_url = environment.endpointTestingApi + 'typologies/other-areas/' + this.idProject + '/' + this.typologyUuid;
              console.log(new_url)
              fetch(new_url, {
              })
              .then(newResponse => newResponse.json())
              .then(data => {
                this.newResponse = data;
                if (this.newResponse) {
                  // console.log(this.newResponse);
                  this.othersAreas = this.newResponse
                  for (let project of this.othersAreas) {
                    var arrayDeCadenas = project.typology_images.split(',');
                    project.typology_images = arrayDeCadenas[0];
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                    project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price);
                  }
                }
              })
              .catch(error => console.error(error))
              let url_properties_similars = environment.endpointTestingApi + 'typologies/project_city/' + this.cityProject + '?page=0&items_per_page=8';
              fetch(url_properties_similars, {
              })
              .then(responseProperties => responseProperties.json())
              .then(data => {
                this.responseProperties = data.search_results;
                // console.log('propiedades son ',data.search_results);
                if (this.responseProperties) {
                  this.propertiesSimilars = this.responseProperties
                  for (let project of this.propertiesSimilars) {
                    var arrayDeCadenas = project.typology_images.split(',');
                    project.typology_images = arrayDeCadenas[0];
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                    project.typology_price = new Intl.NumberFormat("es-ES").format(project.typology_price);
                  }
                }
              })
              .catch(error => console.error(error))
              this.results = true;
              this.setCurrentLocation();
            }
          })
          .catch(error => console.error(error))
        }
      }
    );
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
  beforeCheck(url_find){
    /* Traemos la información del usuario */

  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-detail').foundation();
      if ($('.slider-project-img').length) {
        $('.slider-project-img').not('.slick-initialized').slick({
          arrows: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-properties-project').length) {
        $('.slider-properties-project').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-blueprints-projects').length) {
        $('.slider-blueprints-projects').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
    }
  }
  addCompare(value) {
    var comparatorsId = JSON.parse(sessionStorage.getItem("id"));
    console.log(comparatorsId);
    if (comparatorsId == null) {
      var ids = [];
      ids.push(value)
      sessionStorage.setItem('id',JSON.stringify(ids))
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      this.router.navigate(['comparador']);
      // console.log('este es el id: ',storedIds);
    }else{
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      /* agregar el proyecto de los comparadores */
      const index = storedIds.indexOf(Number(value));
      console.log(index);
      if ( index == -1 ) {
        storedIds.push(value);
      }
      /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
      sessionStorage.setItem('id',JSON.stringify(storedIds))
      this.router.navigate(['comparador']);
      // console.log('este es el id: ',storedIds);
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
    var errorspannLastName = false
    if(values.lastname == null || values.lastname == ""){
      $('#spannLastName').removeClass('hide');
      errorspannLastName = true;
    }else{
      $('#spannLastName').addClass('hide');
      errorspannLastName = false;
    }
    var errorspanPhone = false
    if(values.phone == null || values.phone == ""){
      $('#spanPhone').removeClass('hide');
      errorspanPhone = true;
    }else{
      $('#spanPhone').addClass('hide');
      errorspanPhone = false;
    }
    var errorspanEmail = false
    if(values.email == null || values.email == ""){
      $('#spanEmail').removeClass('hide');
      errorspanEmail = true;
    }else{
      $('#spanEmail').addClass('hide');
      errorspanEmail = false;
    }
    var errorspanContact = false
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContact').removeClass('hide');
      errorspanContact = true;
    }else{
      $('#spanContact').addClass('hide');
      errorspanContact = false;
    }
    var errorspanTerm = false
    if(values.term == null || values.term == ""){
      $('#spanTerm').removeClass('hide');
      errorspanTerm = true;
    }else{
      $('#spanTerm').addClass('hide');
      errorspanTerm = false;
    }
    if(error == false && errorspannLastName == false && errorspanPhone == false && errorspanEmail == false && errorspanContact == false && errorspanTerm == false){
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
            $('#exampleModal1').foundation('open');
            this.form.reset();
          }
        }
      );
    }
  }
  onSubmitDates(values) {
    /* Se recibe los valores del formulario de Citas */
    values.dateAgenda = this.items[0];
    values.type_submit = 'date_form';
    $('#exampleModal1').foundation('open');
    // this.Service.getFormService( values )
    // .subscribe(
    //   data => this.confirm = data,
    //   err => console.log(),
    //   () => {
    //     if(this.confirm){
    //       // $('#modalAlertSuccessful').foundation('open');
    //       console.log('Respondió '+this.confirm);
    //       this.form2.reset();
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
    let errorspannLastNameModal = false;
    if(values.lastname == null || values.lastname == ""){
      $('#spannLastNameModal').removeClass('hide');
      errorspannLastNameModal = true;
    }else{
      $('#spannLastNameModal').addClass('hide');
      errorspannLastNameModal = false;
    }
    let errorspanPhoneModal = false;
    if(values.phone == null || values.phone == ""){
      $('#spanPhoneModal').removeClass('hide');
      errorspanPhoneModal = true;
    }else{
      $('#spanPhoneModal').addClass('hide');
      errorspanPhoneModal = false;
    }
    let errorspanEmailModal = false;
    if(values.email == null || values.email == ""){
      $('#spanEmailModal').removeClass('hide');
      errorspanEmailModal = true;
    }else{
      $('#spanEmailModal').addClass('hide');
      errorspanEmailModal = false;
    }
    let errorspanContactModal = false;
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContactModal').removeClass('hide');
      errorspanContactModal = true;
    }else{
      $('#spanContactModal').addClass('hide');
      errorspanContactModal = false;
    }
    let errorspanTermModal = false;
    if(values.term == null || values.term == ""){
      $('#spanTermModal').removeClass('hide');
      errorspanTermModal = true;
    }else{
      $('#spanTermModal').addClass('hide');
      errorspanTermModal = false;
    }
    if(error == false && errorspannLastNameModal == false && errorspanPhoneModal == false && errorspanEmailModal == false && errorspanContactModal == false && errorspanTermModal == false){
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
          console.log(this.responseSubmit);
          if(this.responseSubmit.id){
            $('#exampleModal1').foundation('open');
            this.form4.reset();
            let type_contact = this.typeContact;
            this.actionAfterContact(type_contact);
          }
          if(!this.responseSubmit.id){
            $('#exampleModal1').foundation('open');
            this.form4.reset();
            let type_contact = this.typeContact;
            this.actionAfterContact(type_contact);
          }
        }
      );
    }
  }
  change(value,type) {
    // console.log(type);
    if(type == 'capacidad_endeudamiento'){
      this.prestamo_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(32);
      this.vivienda_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(45.714286);
      this.vivienda_endeudamiento = new Intl.NumberFormat("es-ES").format(this.vivienda_endeudamiento)
      this.prestamo_endeudamiento = new Intl.NumberFormat("es-ES").format(this.prestamo_endeudamiento)
      // console.log(this.prestamo_endeudamiento);
      // this.form.controls.prestamo_endudamiento.setValue(0);
    }else if(type == 'subsidio_vivienda'){
      let total = 0;
      if(value.ingresos_mensuales_persona_vivienda == ""){
        total = Number(value.ingresos_mensuales_vivienda);
      }else{
        total = Number(value.ingresos_mensuales_vivienda) + Number(value.ingresos_mensuales_persona_vivienda);
      }
      this.total_vivienda = total;
      console.log(total);
      let salarios = 0;
      salarios = (Number(total) / Number(this.salario_minimo));
      console.log(salarios);
      if(salarios <= 2){
        this.subsidio_vivienda = Number(30) * Number(this.salario_minimo);
        this.smmlv_vivienda = 30;
      }else if(salarios > 2 && salarios <= 4){
        this.subsidio_vivienda = Number(20) * Number(this.salario_minimo);
        this.smmlv_vivienda = 20;
      }else if(salarios > 4){
        this.subsidio_vivienda = 0;
        this.smmlv_vivienda = 0;
        /* Agregar un mensaje que diga: Estimado usuario usted no aplica para recibir subsidio */
      }
      this.subsidio_vivienda = new Intl.NumberFormat("es-ES").format(this.subsidio_vivienda)
    }else if(type == 'credito_vienda'){
      let monto_del_prestamo_multi = 0;
      let cuota = 0;
      let cuota_inicial = '';
      let tasa_interes = 9;
      let interes_mensual = 0;
      let monto_prestamo = 0;
      let ingresos_mensuales_min = 0;
      let tasa_de_interes = 0;
      let cuota_inicial_vivienda = 0;
      let plazo_mes = Number(value.plazo_credito);
      let cuota_mensual = 0;
      interes_mensual = ((Number(tasa_interes) / 12) / 100);
      let formula_general_last = Math.pow((1 + Number(interes_mensual)), Number(plazo_mes));
      // const base = Number(1) + Number(interes_mensual);
      // const exponente = Number(value.plazo_credito);
      // let r = 1;
      // for(let i = 0; i<exponente; i++){
      //     r = r * base;
      // }
      var numerador = Number(formula_general_last) * Number(interes_mensual);
      var denominador = Number(formula_general_last) - Number(1);
      this.priceProject = this.priceProject.replace(/[.]/g,'');
      this.priceProject = this.priceProject.replace(/[,]/g,'.');
      if(value.tipo_credito_credito == 'hipotecario'){
        cuota = Number(this.priceProject) * Number(0.30);
        monto_del_prestamo_multi = Number(0.30);
        cuota_inicial = '30%';
      }else if(value.tipo_credito_credito == 'leasing'){
        cuota = Number(this.priceProject) * Number(0.20);
        monto_del_prestamo_multi = Number(0.20);
        cuota_inicial = '20%';
      }
      monto_prestamo = (Number(this.priceProject) * (Number(1) - Number(monto_del_prestamo_multi)));
      tasa_de_interes = tasa_interes;
      cuota_inicial_vivienda = Number(this.priceProject) * Number(monto_del_prestamo_multi);
      cuota_mensual = Number(this.priceProject) * (Number(1) - Number(monto_del_prestamo_multi)) * ((Number(numerador)) / (Number(denominador)));
      ingresos_mensuales_min = (Number(cuota_mensual) * Number(3.3));

      this.monto_prestamo_credito = monto_prestamo;
      this.monto_prestamo_credito = new Intl.NumberFormat("es-ES").format(this.monto_prestamo_credito)
      this.ingresos_mensuales_min_credito = ingresos_mensuales_min;
      this.ingresos_mensuales_min_credito = new Intl.NumberFormat("es-ES").format(this.ingresos_mensuales_min_credito)
      this.tasa_de_interes_credito = tasa_de_interes;
      this.tasa_de_interes_credito = new Intl.NumberFormat("es-ES").format(this.tasa_de_interes_credito)
      this.cuota_inicial_vivienda_credito = cuota_inicial_vivienda;
      this.cuota_inicial_vivienda_credito = new Intl.NumberFormat("es-ES").format(this.cuota_inicial_vivienda_credito)
      this.cuota_inicial_porcentaje_vivienda_credito = cuota_inicial;
      this.cuota_mensual_credito = cuota_mensual;
      this.cuota_mensual_credito = new Intl.NumberFormat("es-ES").format(this.cuota_mensual_credito)
      this.plazo_meses_credito = plazo_mes;
      this.plazo_meses_credito = new Intl.NumberFormat("es-ES").format(this.plazo_meses_credito)
    }
  }
  clickInfo(value){
    /* Quitar decimales en los montos de valor y saldo */

    this.cuotasMensuales = [];
    var today = new Date();
    let cuota_inicial_porcentaje = 0;
    let cuota_inicial = '';
    let ahorros_totales = 0;
    let saldo_diferir = 0;
    this.priceProject = this.priceProject.replace(/[.]/g,'');
    this.priceProject = this.priceProject.replace(/[,]/g,'.');
    if(value.tipo_credito_cuota == 'hipotecario'){
      cuota_inicial_porcentaje = Number(this.priceProject) * Number(0.30);
      cuota_inicial = '30%';
    }else if(value.tipo_credito_cuota == 'leasing'){
      cuota_inicial_porcentaje = Number(this.priceProject) * Number(0.20);
      cuota_inicial = '20%';
    }
    var months = this.monthDiff(new Date(today), new Date(value.fecha_cuota));
    ahorros_totales = Number(value.ahorros_cuota) + Number(value.primas_cuota);
    saldo_diferir = Number(this.priceProject) - Number(cuota_inicial_porcentaje);
    var valor_mes = (Number(saldo_diferir) / Number(months))
    let count = 1;
    let saldo = Number(saldo_diferir);
    this.valorInmuebleCuota = Number(this.priceProject);
    this.valorInmuebleCuota = new Intl.NumberFormat("es-ES").format(this.valorInmuebleCuota);
    this.valorCuotaInicial = Number(cuota_inicial_porcentaje);
    this.valorCuotaInicial = new Intl.NumberFormat("es-ES").format(this.valorCuotaInicial);
    this.valorAhorroCuota = Number(ahorros_totales);
    this.valorAhorroCuota = new Intl.NumberFormat("es-ES").format(this.valorAhorroCuota);
    this.saldoDiferirCuota = Number(saldo_diferir);
    this.saldoDiferirCuota = new Intl.NumberFormat("es-ES").format(this.saldoDiferirCuota);
    this.no_months = months + ' meses';
    for (let i=0; i < months; i++){
      var date_now = new Date();
      saldo = saldo - Number(valor_mes);
      if(saldo < 0){
        saldo = 0;
      }
      var monthYear = this.formatMonthDate(date_now,count);
      let data =  {
        'count': count,
        'date': monthYear,
        'value_cuota': new Intl.NumberFormat("es-ES").format(valor_mes),
        'saldo': new Intl.NumberFormat("es-ES").format(saldo),
      }
      this.cuotasMensuales.push(data);
      count++;
    }
  }
  searchProjectByPrice(value){
    var valor = value.replace(/[.]/g,'');
    valor = valor.replace(/[,]/g,'.');
    sessionStorage.removeItem('price_projects');
    sessionStorage.setItem('price_projects',valor)
    this.router.navigate(['/proyectos']);
  }
  formatDate(dateIn) {
    var dd = String(dateIn.getDate()).padStart(2, '0');
    var mm = String(dateIn.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateIn.getFullYear();
    var today = yyyy + '-' + mm + '-' + dd;
    return today
  }
  formatMonthDate(dateIn, value) {
    dateIn.setMonth(dateIn.getMonth() + value);
    var mm = String(dateIn.getMonth() + 1); //January is 0!
    mm = mm.padStart(2, '0');
    var yyyy = dateIn.getFullYear();
    var new_date =  mm + '-' + yyyy;
    return new_date
  }
  monthDiff(today, date) {
    var months;
    months = (date.getFullYear() - today.getFullYear()) * 12;
    months -= today.getMonth() + 1;
    months += date.getMonth();
    return months <= 0 ? 0 : Number(months) + Number(1);
  }
  // Metodos Cargando
  startSpinner(): void {
    if (this.spinnerService) {
      this.spinnerService.show();
    }
  }
  stopSpinner(): void {
    if (this.spinnerService) {
      console.log("ingrese a parar");
      this.spinnerService.hide();
    }
  }
  contactModal(){
    $('#exampleModal2').foundation('open');
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
  navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }
  activeAfterContact(value){
    this.typeContact = value;
  }
  actionAfterContact(type){
    if(type == 'phone'){
      let phone = '3210000000';
      let url_mailto = 'tel:' + phone
      window.open(url_mailto);
    }else{
      let email = 'email@test.com';
      let url_mailto = 'mailto:' + email
      window.open(url_mailto);
    }
  }
  goSimulator() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("calculadorasSimular").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
}

