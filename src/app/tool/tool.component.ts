import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolService } from './tool.service';
import { environment } from '../../environments/environment';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  providers: [ToolService],
})
export class ToolComponent implements OnInit, AfterViewChecked {
  tags: MetaTag;
  public form4: FormGroup;
  public response: any;
  public responseSubmit: any;
  public responseMostRead: any;
  public form: FormGroup;
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
  constructor( public Service: ToolService, private formBuilder: FormBuilder, private meta: Meta, private router: Router,private spinnerService: NgxSpinnerService ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  projects = [];
  index = 0;
  public results = false;
  url_img_path = 'https://www.estrenarvivienda.com/';
  public stringText: any;

  ngOnInit(): void {
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    this.startSpinner();
    this.createFormModal();

    this.stringText = '...';
    this.createForm();
    /* M??todo para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* Metodo para agregar los metas del sitio */
          if(this.response.metatag_normalized){
            this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
          }
          for (let project of this.response) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            /* format numbr */
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
          }
          this.results = true;
          this.stopSpinner();
          // console.log(this.response.projects_1);
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
      );
      /* M??todo para obtener toda la info de los m??s leidos */
      this.Service.getDataArticle().subscribe(
        (data) => (this.responseMostRead = data),
        (err) => console.log(),
        () => {
          if (this.responseMostRead) {
            // console.log(this.responseMostRead);
            /* si responde correctamente */
          }
          if (this.responseMostRead.error) {
            /* si hay error en la respuesta */
          }
        }
      );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-tool').foundation();
      if ($('.slider-proyects-mobile').length) {
        $('.slider-proyects-mobile').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-blog-home').length) {
        $('.slider-blog-home').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
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
  onKeyUpformatInput(event){
    // this.text +=
    // console.log(event.ingresos_mensuales_vivienda);
    // if(type == 'ingresos_mensuales_vivienda'){
    //   let valor = event.ingresos_mensuales_vivienda.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //   this.form.controls.ingresos_mensuales_vivienda.setValue(valor);
    // }
    return event.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                    "Deseas ser contactado v??a": values.contact
                }
            ],
            "location": values.city
        },
        "main": {
            "privacyNotice": 5323,
            "category": "Cont??ctenos"
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
    if(type == 'capacidad_endeudamiento'){
      this.prestamo_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(32);
      this.prestamo_endeudamiento = new Intl.NumberFormat("es-ES").format(this.prestamo_endeudamiento)
      this.vivienda_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(45.714286);
      this.vivienda_endeudamiento = new Intl.NumberFormat("es-ES").format(this.vivienda_endeudamiento)
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
      console.log(value.tipo_credito_credito);
      var plazo_meses_desktop = Number($("input[id='sliderOutput1']").val());
      var plazo_meses_mobile = Number($("input[id='sliderOutputMobile']").val());
      let monto_del_prestamo_multi = 0;
      let cuota = 0;
      let cuota_inicial = '';
      let tasa_interes = 9;
      let interes_mensual = 0;
      let monto_prestamo = 0;
      let ingresos_mensuales_min = 0;
      let tasa_de_interes = 0;
      let cuota_inicial_vivienda = 0;
      // let plazo_mes = Number(value.plazo_credito);
      let plazo_mes = 0;
      if(plazo_meses_desktop == 50){
        plazo_mes = plazo_meses_mobile;
      }else{
        plazo_mes = plazo_meses_desktop;
      }
      let cuota_mensual = 0;
      interes_mensual = ((Number(tasa_interes) / 12) / 100);
      let formula_general_last = Math.pow((1 + Number(interes_mensual)), Number(plazo_mes));
      var numerador = Number(formula_general_last) * Number(interes_mensual);
      var denominador = Number(formula_general_last) - Number(1);
      // console.log('formula general ',formula_general_last);
      // console.log('numerador  ',numerador);
      // console.log('denominador  ',denominador);
      if(value.tipo_credito_credito == 'hipotecario'){
        cuota = Number(value.valor_vivienda_credito) * Number(0.30);
        monto_del_prestamo_multi = Number(0.30);
        cuota_inicial = '30%';
      }else if(value.tipo_credito_credito == 'leasing'){
        cuota = Number(value.valor_vivienda_credito) * Number(0.20);
        monto_del_prestamo_multi = Number(0.20);
        cuota_inicial = '20%';
      }
      monto_prestamo = (Number(value.valor_vivienda_credito) * (Number(1) - Number(monto_del_prestamo_multi)));
      // console.log('monto del prestamo ',monto_del_prestamo_multi);
      tasa_de_interes = tasa_interes;
      cuota_inicial_vivienda = Number(value.valor_vivienda_credito) * Number(monto_del_prestamo_multi);
      cuota_mensual = Number(value.valor_vivienda_credito) * (Number(1) - Number(monto_del_prestamo_multi)) * ((Number(numerador)) / (Number(denominador)));
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
      // this.cuota_inicial_porcentaje_vivienda_credito = new Intl.NumberFormat("es-ES").format(this.cuota_inicial_porcentaje_vivienda_credito)
      this.cuota_mensual_credito = cuota_mensual;
      this.cuota_mensual_credito = new Intl.NumberFormat("es-ES").format(this.cuota_mensual_credito)
      this.plazo_meses_credito = plazo_mes;
      this.plazo_meses_credito = new Intl.NumberFormat("es-ES").format(this.plazo_meses_credito)
    }
  }
  clickInfo(value){
    /* Quitar decimales en los montos de valor y saldo */
    var today = new Date();
    let data = {};
    this.cuotasMensuales = [];
    let cuota_inicial_porcentaje = 0;
    let cuota_inicial = '';
    let ahorros_totales = 0;
    let saldo_diferir = 0;
    let saldo_cuota_diferir = 0;
    if(value.tipo_credito_cuota == 'hipotecario'){
      cuota_inicial_porcentaje = Number(value.valor_inmueble_cuota) * Number(0.30);
      cuota_inicial = '30%';
    }else if(value.tipo_credito_cuota == 'leasing'){
      cuota_inicial_porcentaje = Number(value.valor_inmueble_cuota) * Number(0.20);
      cuota_inicial = '20%';
    }
    var months = this.monthDiff(new Date(today), new Date(value.fecha_cuota));
    ahorros_totales = Number(value.ahorros_cuota) + Number(value.primas_cuota);
    saldo_cuota_diferir = Number(cuota_inicial_porcentaje) - Number(ahorros_totales);
    saldo_diferir = Number(value.valor_inmueble_cuota) - Number(cuota_inicial_porcentaje) - Number(ahorros_totales);
    var valor_mes = (Number(saldo_cuota_diferir) / Number(months))
    let count = 1;
    let saldo = Number(saldo_cuota_diferir);
    this.valorInmuebleCuota = Number(value.valor_inmueble_cuota);
    this.valorInmuebleCuota = new Intl.NumberFormat("es-ES").format(this.valorInmuebleCuota)
    this.valorCuotaInicial = Number(cuota_inicial_porcentaje);
    this.valorCuotaInicial = new Intl.NumberFormat("es-ES").format(this.valorCuotaInicial)
    this.valorAhorroCuota = Number(ahorros_totales);
    this.valorAhorroCuota = new Intl.NumberFormat("es-ES").format(this.valorAhorroCuota)
    this.saldoDiferirCuota = Number(saldo_diferir);
    this.saldoDiferirCuota = new Intl.NumberFormat("es-ES").format(this.saldoDiferirCuota)
    this.no_months = months + ' meses';
    for (let i=0; i < months; i++){
      var date_now = new Date();
      saldo = saldo - Number(valor_mes);
      if(saldo < 0){
        saldo = 0;
      }
      var monthYear = this.formatMonthDate(date_now,count);
      data =  {
        'count': count,
        'date': monthYear,
        'value_cuota': new Intl.NumberFormat("es-ES").format(valor_mes),
        'saldo': new Intl.NumberFormat("es-ES").format(saldo),
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
  monthDiff(today, date)
  {
    var months;
    months = (date.getFullYear() - today.getFullYear()) * 12;
    months -= today.getMonth() + 1;
    months += date.getMonth();
    return months <= 0 ? 0 : Number(months) + Number(1);
  }
  searchProjectByPrice(value){
    var valor = value.replace(/[.]/g,'');
    valor = valor.replace(/[,]/g,'.');
    sessionStorage.removeItem('price_projects');
    sessionStorage.setItem('price_projects',valor)
    this.router.navigate(['/proyectos-vivienda']);
  }
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
