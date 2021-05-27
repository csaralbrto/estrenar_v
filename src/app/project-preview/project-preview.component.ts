import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService
    ) { }
    dataPath = environment.endpoint;
    dataSrcImg = environment.endpointTestingApiUrl
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
  
    public maps_url;

  ngOnInit(): void {
    this.startSpinner();
    this.createForm();
    this.createFormDates();
    this.createFormSimuladores();
    this.createFormModal();

    if (sessionStorage['previewProject']) {
      var project_preview = JSON.parse(sessionStorage.getItem("previewProject"));
      this.projectPreview = project_preview[0];
      console.log(this.projectPreview)
      this.response = this.projectPreview;
      this.galeria = this.response.images_project;
      // const latong = this.response.latitude_project + ',' + this.response.longitude_project;
      const latong = '4.6854498,-74.0767686';
      this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ latong +"&hl=es&z=14&output=embed");
      this.results = true;
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
      this.stopSpinner();
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

}
