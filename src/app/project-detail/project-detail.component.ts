import { Component, OnInit, AfterViewChecked, ViewChild, Input, ElementRef, ApplicationRef, PLATFORM_ID, Inject } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl, Meta} from '@angular/platform-browser';
import { ProjectDetailService } from './project-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {

  @ViewChild('streetviewMap') streetviewMap: ElementRef;
  @ViewChild('streetviewPano') streetviewPano: ElementRef;
  // @Input() latitude: number;
  // @Input() longitude: number;
  @Input() zoom: number = 11;
  @Input() heading: number = 34;
  @Input() pitch: number = 10;
  @Input() scrollwheel: boolean = false;

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
  public mapTypeId: any;
  dataProjectUrl = '?include=field_typology_project.field_project_logo,field_typology_image,field_typology_project.field_project_video,field_typology_feature.field_icon_feature,field_typology_feature.parent,field_typology_feature.parent.field_icon_feature,field_typology_project.field_project_location,field_typology_project.field_project_builder.field_builder_logo,field_typology_project.field_project_location.field_location_opening_hours.parent,field_typology_project.field_project_feature.parent,field_typology_project.field_project_location.field_location_city';
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ProjectDetailService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapsAPILoader: MapsAPILoader,
    private appRef: ApplicationRef
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

  // latitude: 6.1891388;
  // longitude: 75.5799235;
  // zoom:number;
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

  public maps_url;

  ngOnInit(): void {

    this.startSpinner();
    this.createForm();
    this.createFormDates();
    this.createFormSimuladores();
    this.createFormModal();
    this.setCurrentLocation();
    this.renderStreetView();



    this.title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(this.title).subscribe(
      (data) => (this.response = data.jsonapi),
      (err) => console.log(),
      () => {
        if(this.response){
          // console.log()
          // this.beforeCheck(this.response.individual);
          /* captamos el uuid de la tipologia */
          this.typologyUuid = this.response.individual;
          this.typologyUuid = this.typologyUuid.split('/typology/');
          this.typologyUuid = this.typologyUuid[1];
          var url = this.response.individual + this.dataProjectUrl;
          var data = "";
          fetch(url, {
          })
          .then(response => response.json())
          .then(data => {
            // console.log(data)
            this.response = data.data;
            // console.log(this.response);
            if (this.response) {
              /* si responde correctamente en la respuesta */
              console.log(this.response);
              if(this.response.metatag_normalized){
                this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
              }
              if(this.response.field_virtual_tour !== null){
                this.urlTour = this.response.field_virtual_tour.uri;
                this.urlTour = this.urlTour.replace('/watch?v=', "/embed/");
                this.safeURLVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlTour);
                console.log(this.urlTour);
              }
              if(this.response.field_typology_video.length && this.urlTour){
                this.video_url = "video";
                this.tour_url = "tour";
                $('#video_tab').attr('data-tabs-target', 'video');
                $('#tour_tab').attr('data-tabs-target', 'tour');
                $('#video_tab').attr('href', '#video');
                $('#tour_tab').attr('href', '#tour');
              }else{
                this.video_url = "images";
                this.tour_url =  "images";
                $('#video_tab').attr('data-tabs-target', 'images');
                $('#tour_tab').attr('data-tabs-target', 'images');
                $('#video_tab').attr('href', '#images');
                $('#tour_tab').attr('href', '#images');
              }
              this.cityProject = this.response.field_typology_project.field_project_location[0].field_location_city.drupal_internal__tid;
              this.priceProject = this.response.field_typology_price
              this.idProject = this.response.drupal_internal__nid;
              const latong = this.response.field_typology_project.field_project_location[0].field_location_geo_data.latlon;
              // mapa Yenifer

              this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ latong +"&hl=es&z=14&output=embed");
              this.galeria = this.response.field_typology_image;
              // console.log('esta es la galeria: ',this.galeria);
              // console.log('tamaño de la galeria: ',this.galeria.length);
              this.operacion= this.galeria.length;
              if(this.operacion % 2 == 0)
              {
                this.valoresPares = "par";
                  // console.log(this.valoresPares);
              }
              else
              {
                this.valoresPares = "impar";
                // console.log(this.valoresPares);
              }

              this.caracteristicas = this.response.field_typology_feature;
              /* caracteristicas del inmueble */
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
                }else{
                  name_cara = caracteristica_tipologia.parent[0].name+': '+ caracteristica_tipologia.name
                  if( caracteristica_tipologia.parent[0].field_icon_feature.uri){
                    img_src = this.dataSrcImg + caracteristica_tipologia.parent[0].field_icon_feature.uri.url;
                  }else{
                    img_src = '/assets/images/icon-medida.png';
                  }
                }
                caracteristica_tipologia.name_only = name_cara;
                caracteristica_tipologia.img_src = img_src
              }
              this.caracteristicasProject = this.response.field_typology_project.field_project_feature;
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
                  if(caracteristica_project.parent[0].field_icon_feature.uri){
                    img_src = this.dataSrcImg + caracteristica_project.parent[0].field_icon_feature.uri.url;
                  }else{
                    img_src = '/assets/images/caracteristica.png';
                  }
                }
                caracteristica_project.name_only = name_cara;
                caracteristica_project.img_src = img_src
              }
              let new_url = environment.endpointTestingApi + 'typologies/other-areas/' + this.idProject + '/' + this.typologyUuid;
              fetch(new_url, {
              })
              .then(newResponse => newResponse.json())
              .then(data => {
                this.newResponse = data;
                if (this.newResponse) {
                  // console.log(this.newResponse);
                  this.othersAreas = this.newResponse
                }
              })
              .catch(error => console.error(error))
              let url_properties_similars = environment.endpointTestingApi + 'typologies/project_city/' + this.cityProject + '?page=0&items_per_page=8';
              fetch(url_properties_similars, {
              })
              .then(responseProperties => responseProperties.json())
              .then(data => {
                this.responseProperties = data.search_results;
                if (this.responseProperties) {
                  console.log(this.responseProperties);
                  this.propertiesSimilars = this.responseProperties
                  for (let project of this.propertiesSimilars) {
                    var arrayDeCadenas = project.typology_images.split(',');
                    project.typology_images = arrayDeCadenas[0];
                    var arrayDeCadenas2 = project.project_category.split(',');
                    project.project_category = arrayDeCadenas2;
                  }
                }
              })
              .catch(error => console.error(error))
              this.results = true;
            }
          })
          .catch(error => console.error(error))
        }
      }
    );
    /* Método para obtener areas disponibles */
    // this.Service.availableAreas().subscribe(
    //   (data) => (this.responseAvailableAreas = data),
    //   (err) => console.log(),
    //   () => {
    //     if (this.responseAvailableAreas) {
    //       this.projectsAvailableAreas = this.responseAvailableAreas.search_results;
    //       for (let project of this.projectsAvailableAreas) {
    //         var arrayDeCadenas = project.typology_images.split(',');
    //         project.typology_images = arrayDeCadenas[0];
    //         var arrayDeCadenas2 = project.project_category.split(',');
    //         project.project_category = arrayDeCadenas2;
    //         this.results = true;
    //       }
    //       /* si responde correctamente */
    //     }
    //   }
    // );
  }

  private setCurrentLocation() {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = 6.25184;
        this.longitude = -75.56359;
        this.zoom = 15;
        this.mapTypeId = 'hybrid';
      });
      // console.log(this.latitude);
      // console.log(this.longitude);

    }
  }
  renderStreetView() {
    this.latitude = 6.25184;
    this.longitude = -75.56359;
    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        const center = { lat: +this.latitude, lng: +this.longitude };
        console.log(center);
        const map = new window['google'].maps.Map(
          this.streetviewMap.nativeElement
        );
        const panorama = new window['google'].maps.StreetViewPanorama(
          this.streetviewPano.nativeElement,
          {
            position: center,
            pov: { heading: this.heading, pitch: this.pitch },
            scrollwheel: this.scrollwheel,
          }
        );
        map.setStreetView(panorama);
        this.appRef.tick();
      });
    }
  }

  beforeCheck(url_find){
    /* Traemos la información del usuario */

  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-detail').foundation();
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
      this.stopSpinner();
    }
  }
  addCompare(value) {
    if (!sessionStorage['id']) {
      var ids = [];
      ids.push(value)
      sessionStorage.setItem('id',JSON.stringify(ids))
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      this.router.navigate(['comparador']);
      // console.log('este es el id: ',storedIds);
    }else{
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      for (let ids of storedIds) {
        if(ids === value){
        }else{
          storedIds.push(value);
        }
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
      journalOption: new FormControl(''),
      house_for: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
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
  onSubmitDates(values) {
    /* Se recibe los valores del formulario de Citas */
    values.type_submit = 'date_form';
    this.Service.getFormService( values )
    .subscribe(
      data => this.confirm = data,
      err => console.log(),
      () => {
        if(this.confirm){
          // $('#modalAlertSuccessful').foundation('open');
          console.log('Respondió '+this.confirm);
          this.form.reset();
        }
        if(this.confirm.error){
          // $('#modalAlertError').foundation('open');
        }
      }
    );
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
  change(value,type) {
    // console.log(type);
    if(type == 'capacidad_endeudamiento'){
      this.prestamo_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(32);
      this.vivienda_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(45.714286);
      console.log(this.prestamo_endeudamiento);
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
      this.ingresos_mensuales_min_credito = ingresos_mensuales_min;
      this.tasa_de_interes_credito = tasa_de_interes;
      this.cuota_inicial_vivienda_credito = cuota_inicial_vivienda;
      this.cuota_inicial_porcentaje_vivienda_credito = cuota_inicial;
      this.cuota_mensual_credito = cuota_mensual;
      this.plazo_meses_credito = plazo_mes;
    }
  }
  clickInfo(value){
    /* Quitar decimales en los montos de valor y saldo */
    var today = new Date();
    let cuota_inicial_porcentaje = 0;
    let cuota_inicial = '';
    let ahorros_totales = 0;
    let saldo_diferir = 0;
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
    this.valorCuotaInicial = Number(cuota_inicial_porcentaje);
    this.valorAhorroCuota = Number(ahorros_totales);
    this.saldoDiferirCuota = Number(saldo_diferir);
    for (let i=0; i < months; i++){
      var date_now = new Date();
      saldo = saldo - Number(valor_mes);
      var monthYear = this.formatMonthDate(date_now,count);
      let data =  {
        'count': count,
        'date': monthYear,
        'value_cuota': valor_mes,
        'saldo': saldo,
      }
      this.cuotasMensuales.push(data);
      count++;
    }
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
      // console.log("ingrese a parar");
      this.spinnerService.hide();
    }
  }
  contactModal(){
    $('#exampleModal2').foundation('open');
  }
}
