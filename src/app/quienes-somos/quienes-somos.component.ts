import { Component, OnInit } from '@angular/core';
import { QuienesSomosService } from './quienes-somos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.scss'],
  providers: [QuienesSomosService],
})
export class QuienesSomosComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public responseNewsletter: any;
  public responseData: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = '';
  public form2: FormGroup;
  public results = false;
  imgPath = 'https://lab.estrenarvivienda.com/';
  dataImg = '?include=field_page_paragraphs.field_ev_team_image';

  constructor( public Service: QuienesSomosService, private meta: Meta,private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.createFormSuscribe();
    this.startSpinner();
    /* Método para obtener toda la info */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          this.stringQuery = this.response.jsonapi.individual;
          this.getDataSearch();
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  getDataSearch(){
    this.Service.getInfo(this.stringQuery + this.dataImg)
      .subscribe(
        data => (this.responseData = data.data),
        err => console.log(),
        () => {
          if (this.responseData) {
            if(this.responseData.metatag_normalized){
              this.tags = new MetaTag(this.responseData.metatag_normalized, this.meta);
            }
            console.log(this.responseData.field_page_paragraphs);
            this.dataInfoImg = this.responseData.field_page_paragraphs;
            // this.stopSpinner();
            this.results = true;

          }
          /* si responde correctamente */
          if (this.responseData.error) {
            /* si hay error en la respuesta */
            // this.stopSpinner();
            this.results = true;
          }

        }
      );

  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-quienes-somos').foundation();
      // $('html,body').scrollTop(0);
      this.stopSpinner();
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
      data =>(this.responseNewsletter = data),
      err => console.log(),
      () => {
        // console.log(this.responseNewsletter.sid);
        if(this.responseNewsletter.sid){
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
