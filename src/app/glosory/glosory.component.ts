import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GlosoryService } from './glosory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-glosory',
  templateUrl: './glosory.component.html',
  styleUrls: ['./glosory.component.scss'],
  providers: [GlosoryService],
})
export class GlosoryComponent implements OnInit {
  tags: MetaTag;
  letter = 'a';
  public response: any;
  public responseData: any;
  public responseNewslaetter: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = null;
  public results = false;
  public form2: FormGroup;


  constructor( public Service: GlosoryService, private meta: Meta,private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder ) {}

  ngOnInit(): void {
    this.createFormSuscribe();
    this.startSpinner();
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    /* Método para obtener toda la info */
    this.Service.getDataGlosary(this.stringQuery?this.stringQuery:this.letter)
    .subscribe(
      data => (this.response = data.data),
      err => console.log(),
      () => {
        if (this.response) {
          /* Metodo para agregar los metas del sitio */
          if(this.response.metatag_normalized){
            this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
          }
          this.results = true;
          this.stopSpinner();
        }
      }
    );
  }
  change(value) {
    // console.log('entre a cambiar')
    this.startSpinner();
    let term = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          let p = key;
          term = value[key];
          this.stringQuery = term;
        }
      },this);
      /* llamamos la funcion que va a buscar */
      this.getDataSearch();
  }
  getDataSearch(){
    this.Service.getDataGlosary(this.stringQuery)
    .subscribe(
      data => (this.response = data.data),
      err => console.log(),
      () => {
        if (this.response) {
          // console.log(this.response);
          this.results = true;
          this.stopSpinner();

        }
      }
    );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-glosory').foundation();
    }
  }
  createFormSuscribe() {
    this.form2 =  this.formBuilder.group({
      email_suscribe: new FormControl(''),
    });
  }
  onSubmitSuscribe(values) {
    this.startSpinner();
    /* Se recibe los valores del formulario */
    // console.log(values);
    let payload = {
      "webform_id":"newsletter",
      "correo_electronico":values.email_suscribe,
    };
    // console.log(payload);
    this.Service.suscribeNewsletter( payload )
    .subscribe(
      data =>(this.responseNewslaetter = data),
      err => console.log(),
      () => {
        // console.log(this.responseNewslaetter.sid);
        if(this.responseNewslaetter.sid){
          this.stopSpinner();
          $('#exampleModalSuscribe').foundation('open');
          this.createFormSuscribe();
        }else{
          this.stopSpinner();
          $('#exampleModalNosuscribe').foundation('open');
        }
      }
    );
  }
  startSpinner(): void {
    if (this.spinnerService) {
      // console.log("ingreso spinner..");
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
