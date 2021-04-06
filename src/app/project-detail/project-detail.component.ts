import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ProjectDetailService } from './project-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
declare function todayDate(): any;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {
  public response: any;
  public responseSubmit: any;
  public responseAvailableAreas: any;
  public projectsAvailableAreas: any;
  public form: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;
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
  dataProjectUrl = '?include=field_typology_project.field_project_logo,field_typology_image,field_typology_project.field_project_video,field_typology_feature.parent,field_typology_project.field_project_location,field_typology_project.field_project_builder.field_builder_logo,field_typology_project.field_project_location.field_location_opening_hours.parent,field_typology_project.field_project_feature.parent';
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ProjectDetailService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  public galeria;
  public caracteristicas;
  public caracteristicasProject;
  public confirm: any;

  public maps_url;

  ngOnInit(): void {

    //Asignamos la fecha actual al campo de fecha
    this.createForm();
    this.createFormDates();
    this.createFormSimuladores();
    todayDate();

    this.title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(this.title).subscribe(
      (data) => (this.response = data.jsonapi),
      (err) => console.log(),
      () => {
        if(this.response){
          // console.log()
          // this.beforeCheck(this.response.individual);
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
              const latong = this.response.field_typology_project.field_project_location[0].field_location_geo_data.latlon;

              this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ latong +"&hl=es&z=14&output=embed");
              this.galeria = this.response.field_typology_image;
              this.caracteristicas = this.response.field_typology_feature;
              /* caracteristicas del inmueble */
              for (let project of this.caracteristicas) {
                var name_cara;
                if(project.parent[0].id === 'virtual'){
                  name_cara = project.name
                }else{
                  name_cara = project.parent[0].name+': '+ project.name
                }
                project.name_only = name_cara;
              }
              this.caracteristicasProject = this.response.field_typology_project.field_project_feature;
              /* caracteristicas del proyecto */
              for (let project of this.caracteristicasProject) {
                var name_cara;
                if(project.parent[0].id === 'virtual'){
                  name_cara = project.name
                }else{
                  name_cara = project.parent[0].name+': '+ project.name
                }
                project.name_only = name_cara;
              }
              this.caracteristicasProject.name_only = name_cara;

              // console.log(this.galeria);
              this.results = true;
            }
          })
          .catch(error => console.error(error))
        }
      }
    );
    /* Método para obtener areas disponibles */
    this.Service.availableAreas().subscribe(
      (data) => (this.responseAvailableAreas = data),
      (err) => console.log(),
      () => {
        if (this.responseAvailableAreas) {
          this.projectsAvailableAreas = this.responseAvailableAreas.search_results;
          for (let project of this.projectsAvailableAreas) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            this.results = true;
          }
          /* si responde correctamente */
        }
      }
    );
  }
  beforeCheck(url_find){
    /* Traemos la información del usuario */
    
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-detail').foundation();
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
  change(value,type) {
    console.log(type);
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
        cuota = Number(value.valor_vivienda_credito) * Number(0.30);
        monto_del_prestamo_multi = Number(0.30);
        cuota_inicial = '30%';
      }else if(value.tipo_credito_credito == 'leasing'){
        cuota = Number(value.valor_vivienda_credito) * Number(0.20);
        monto_del_prestamo_multi = Number(0.20);
        cuota_inicial = '20%';
      }
      monto_prestamo = (Number(value.valor_vivienda_credito) * (Number(1) - Number(monto_del_prestamo_multi)));
      tasa_de_interes = tasa_interes;
      cuota_inicial_vivienda = Number(value.valor_vivienda_credito) * Number(monto_del_prestamo_multi);
      cuota_mensual = Number(value.valor_vivienda_credito) * (Number(1) - Number(monto_del_prestamo_multi)) * ((Number(numerador)) / (Number(denominador)));
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
      cuota_inicial_porcentaje = Number(value.valor_inmueble_cuota) * Number(0.30);
      cuota_inicial = '30%';
    }else if(value.tipo_credito_cuota == 'leasing'){
      cuota_inicial_porcentaje = Number(value.valor_inmueble_cuota) * Number(0.20);
      cuota_inicial = '20%';
    }
    var months = this.monthDiff(new Date(today), new Date(value.fecha_cuota));
    ahorros_totales = Number(value.ahorros_cuota) + Number(value.primas_cuota);
    saldo_diferir = Number(value.valor_inmueble_cuota) - Number(cuota_inicial_porcentaje);
    var valor_mes = (Number(saldo_diferir) / Number(months))
    let count = 1;
    let saldo = Number(saldo_diferir);
    this.valorInmuebleCuota = Number(value.valor_inmueble_cuota);
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
}
