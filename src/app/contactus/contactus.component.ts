import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ContactusService } from './contactus.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
declare function todayDate(): any;
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public responseError: any;
  public responseSubmit: any;
  public responseNewsletter: any;
  public form: FormGroup;
  public form2: FormGroup;
  public results = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ContactusService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.startSpinner();
    this.createFormSuscribe();
    this.createForm();
    this.results = true;
    if(this.response.metatag_normalized){
      this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
    }
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-contactus').foundation();
      this.stopSpinner();
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      comment: new FormControl(''),
      city: new FormControl('Ciudad'),
      contact: new FormControl('Deseas ser contactado'),
      term: new FormControl(''),
    });
  }
  onSubmit(values) {
    console.log(values);
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
    if(values.city == null || values.city == "" || values.city == "Ciudad"){
      $('#spanCity').removeClass('hide');
      error = true;
    }else{
      $('#spanCity').addClass('hide');
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
            "emailCopy": true
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
      err => {
        // console.log(err)
        this.responseError = err;
        if(this.responseError.status == 400){
          this.stopSpinner();
          $('#exampleModalNosuscribe').foundation('open');
          this.createFormSuscribe();
        }
      },
      () => {
        // console.log(this.responseNewsletter);
        if(this.responseNewsletter.sid){
          this.stopSpinner();
          $('#exampleModalSuscribe').foundation('open');
          this.createFormSuscribe();
        }else{
          this.stopSpinner();
          $('#exampleModalNosuscribe').foundation('open');
          this.createFormSuscribe();
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
