import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Options, LabelType } from 'ng5-slider';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { WizardService } from './wizard.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [WizardService, Options],
})
export class WizardComponent implements OnInit, AfterViewChecked{
  public confirm: any;
  public form: FormGroup;
  public responseSearchData: any;
  public data: any;
  public new_url: any;
  public responsePresupuestoData: any;
  public responseSubsidioData: any;
  public responseTiempoData: any;
  public responseContactadoData: any;
  public responseViviendaData: any;
  public results = false;
  public searchPlace: any;
  public searchPlaceName: any;
  public minPresupuesto: number;
  public maxPresupuesto: number;
  public valueShow: any;
  public subsidyOption: any;
  public timeOption: any;
  public contactOption: any;
  arrayOptions: string[] = [];
  arrayPresupuesto: any;
  arrayOptions2: string[] = [];
  minValue: number = 750000000;
  maxValue: number = 1900000000;
  minValueFlor: number = 0;
  maxValueCeil: number = 3000000000;
  options: Options = {
    floor: this.minValueFlor,
    ceil: this.maxValueCeil,
    translate: (value: number, label: LabelType): string => {
      let number = new Intl.NumberFormat().format(value)
      switch (label) {
        case LabelType.Low:
          return '<b>Desde:</b> $' + number;
        case LabelType.High:
          return '<b>Hasta:</b> $' + number;
        default:
          return '$' + number;
      }
    }
  };

  constructor(
    public Service: WizardService,
    private formBuilder: FormBuilder,
    public Options: Options,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private http: Http) {
      this.http = http;
    }

  ngOnInit(): void {
    // $(document).foundation();
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    this.startSpinner();
    this.createForm();

    /* Método para obtener toda la info de locaciones */
    this.Service.getDataSearch().subscribe(
      (data) => (this.responseSearchData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseSearchData) {
          // console.log(this.responseSearchData);
          for (let project of this.responseSearchData) {
            // console.log(project.name)
            this.arrayOptions.push(project);
          }
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseSearchData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info de presupuestos */
    this.Service.getDataPresupuesto().subscribe(
      (data) => (this.responsePresupuestoData = data.data),
      (err) => console.log(),
      () => {
        if (this.responsePresupuestoData) {
          // console.log(this.responsePresupuestoData);
          let count = 0;
          for (let presupuesto of this.responsePresupuestoData) {
              presupuesto.name = presupuesto.name.replace('$','');
              presupuesto.name = presupuesto.name.replace('.','');
              presupuesto.name = presupuesto.name.replace('.','');
              // console.log(Number(presupuesto.name));
              if(count == 0){
                this.minPresupuesto = Number(presupuesto.name);
              }else{
                this.maxPresupuesto = Number(presupuesto.name);
              }
              count = count + 1;
            }
          // console.log(this.responsePresupuestoData);
          // this.arrayPresupuesto.push(this.responsePresupuestoData);
          // this.minPresupuesto = this.arrayPresupuesto[0].name;
          // this.maxPresupuesto = this.arrayPresupuesto[count].name;
          // console.log(this.maxPresupuesto);
          this.minValueFlor = this.minPresupuesto;
          this.maxValueCeil = this.maxPresupuesto;
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responsePresupuestoData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info subsidio */
    this.Service.getDataSubsidio().subscribe(
      (data) => (this.responseSubsidioData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseSubsidioData) {
          // console.log(this.responseSubsidioData);
          // for (let subsidio of this.responseSubsidioData) {
          // }
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseSubsidioData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info de tiempos */
    this.Service.getDataTiempo().subscribe(
      (data) => (this.responseTiempoData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseTiempoData) {
          // console.log(this.responseTiempoData);
          // for (let subsidio of this.responseTiempoData) {
          // }
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseTiempoData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info de ser contactado */
    this.Service.getDataContacado().subscribe(
      (data) => (this.responseContactadoData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseContactadoData) {
          // console.log(this.responseContactadoData);
          // for (let subsidio of this.responseContactadoData) {
          // }
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseContactadoData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    /* Método para obtener toda la info de vivienda */
    this.Service.getDataVivienda().subscribe(
      (data) => (this.responseViviendaData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseViviendaData) {
          // console.log(this.responseViviendaData);
          // for (let subsidio of this.responseViviendaData) {
          // }
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseViviendaData.error) {
          /* si hay error en la respuesta */
        }
      }
    );

  }
  filterValues(value: string) {
      console.log('entre '+ value);
      const filterValue = value.toUpperCase();
      return this.arrayOptions.filter(option => option.toUpperCase().includes(filterValue));
  }
  closeWizard(values) {
    console.log(values);
    var error = false;
    let errorspanName = false;
    if(values.name == null || values.name == ""){
      $('#spanName').removeClass('hide');
      errorspanName = true;
    }else{
      $('#spanName').addClass('hide');
      errorspanName = false;
    }
    let errorspannLastName = false;
    if(values.last_name == null || values.last_name == ""){
      $('#spannLastName').removeClass('hide');
      errorspannLastName = true;
    }else{
      $('#spannLastName').addClass('hide');
      errorspannLastName = false;
    }
    let errorspanPhone = false;
    if(values.phone == null || values.phone == ""){
      $('#spanPhone').removeClass('hide');
      errorspanPhone = true;
    }else{
      $('#spanPhone').addClass('hide');
      errorspanPhone = false;
    }
    let errorspanEmail = false;
    if(values.email == null || values.email == ""){
      $('#spanEmail').removeClass('hide');
      errorspanEmail = true;
    }else{
      $('#spanEmail').addClass('hide');
      errorspanEmail = false;
    }
    let errorspanContact = false;
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContact').removeClass('hide');
      errorspanContact = true;
    }else{
      $('#spanContact').addClass('hide');
      errorspanContact = false;
    }
    let errorspanTerm = false;
    if(values.term == null || values.term == ""){
      $('#spanTerm').removeClass('hide');
      errorspanTerm = true;
    }else{
      $('#spanTerm').addClass('hide');
      errorspanTerm = false;
    }
    // $('#welcomeModal').foundation('close');
    if(errorspanName == true || errorspannLastName == true || errorspanPhone == true || errorspanEmail == true || errorspanContact == true || errorspanTerm == true){
      error = true;
    }else{
      error = false;
    }
    if(!error){
      let payload = {
        "webform_id": "wizard",
        "user_preference_location": this.searchPlace,
        "user_preference": [
            24,
            values.subsidy,
            values.waitTime,
            values.contactType,
            values.typeSearch
        ],
        "user_name": values.name,
        "user_phone": values.phone,
        "user_mail": values.email,
        "user_privacy_notice": 5323
      }
      // this.router.navigate(['/home']);
      location.href ="/home";
    }

  }
  changeStepWizard(idStep) {
    for (let index = 0; index <= 6; index++) {
      if (idStep == index) {
        $('#wizard' + index).removeAttr('style');
        // console.log(index + '-muestro este item ');
      } else {
        // console.log(index + '-oculto este item ');
        $('#wizard' + index).css('display', 'none');
      }
    }
    if(idStep >2){
      if(this.valueShow !== ''){
        this.valueShow = new Intl.NumberFormat("es-ES").format(this.minValue);
      }
    }
  }
  onSubmit(value) {
    this.Service.saveformData('submit', value).subscribe(
      (data) => (this.confirm = data),
      (err) => console.log(),
      () => {
        if (this.confirm) {
          // $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if (this.confirm.error) {
          // $('#modalAlertError').foundation('open');
        }
      }
    );
  }
  createForm() {
    this.form =  this.formBuilder.group({
      search: new FormControl(''),
      budget_from: new FormControl(''),
      budget_to: new FormControl(''),
      purchase_budget: new FormControl(''),
      subsidyYes: new FormControl(''),
      subsidyNo: new FormControl(''),
      subsidy: new FormControl(''),
      waitTime: new FormControl(''),
      contactType: new FormControl(''),
      name: new FormControl(''),
      last_name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      typeSearch: new FormControl(''),
      contact: new FormControl('Deseas ser contactado'),
      term: new FormControl(''),
    });
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-wizard').foundation();
      // $('html,body').scrollTop(0);
      // $('.autocomplete-container .input-container input').one("click", function() {
      //   console.log('entre');
      //   $('.autocomplete-container .input-container input').css('background-image','none')
      // });
      this.stopSpinner();
      // console.log(this.minValue);
    }
  }
  /* Autocomplete keyword */
  keyword = 'name';
  selectEvent(item) {
    // console.log('el valor seleccionado es: ',item)
    /* quitar el placeholder del input autocomplete */
    $('.autocomplete-container .input-container input').css('background-image','none')
    this.searchPlace = item.drupal_internal__tid;
    this.searchPlaceName = item.name;
  }
  getNewData(event){
    /* quitar el placeholder del input autocomplete */
    $('.autocomplete-container .input-container input').css('background-image','none')
    var cadena = this.mostrarSinDiacriticos(event)
    console.log('cadena:',typeof cadena);
    $('.autocomplete-container .input-container input').val(cadena);
    this.new_url = "https://lab.estrenarvivienda.com/api/taxonomy_term/user_preferences_location?filter[name][operator]=CONTAINS&filter[name][value]=" + cadena + "&sort=weight";
    console.log(this.new_url);
    this.responseSearchData = [];
    fetch(this.new_url, {
    })
    .then(newResponse => newResponse.json())
    .then(data => {
      this.responseSearchData = data.data;
      // console.log(this.responseSearchData);
      if (this.responseSearchData) {
        for (let project of this.responseSearchData) {
          // console.log(project.name)
          this.arrayOptions.push(project);
        }
      }
    })
  }
  quitarAcentos(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
    return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
  }
  mostrarSinDiacriticos(inp){
    return this.eliminarDiacriticos(inp);
  }
  eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
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
  changeSelected(value,type){
    if(type == 'medio_contact'){
      $('label.medio_contact').removeClass('label-selectd-contact');
      for (let index of this.responseContactadoData) {
        if(index.drupal_internal__tid == value){
          this.contactOption = index.name;
        }
      }
    $("#"+value).addClass('label-selectd-contact')
    }else if(type == 'subsidy'){
      $('label.subsidy').removeClass('label-selectd-wizard');
      this.subsidyOption = $("#"+value).text();
      $("#"+value).addClass('label-selectd-wizard')
    }
  }
  selectWaitTime(valueSelected){
    for (let index of this.responseTiempoData) {
      if(index.drupal_internal__tid == valueSelected){
        this.timeOption = index.name;
      }
    }
  }
  restart(){

    this.searchPlaceName = null;
    this.valueShow = null;
    this.subsidyOption = null;
    this.timeOption = null;
    this.contactOption = null;
    this.form.reset();
    this.changeStepWizard(1);
  }
}
