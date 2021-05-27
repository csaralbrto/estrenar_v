import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RegisterService } from './register.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public response: any;
  public results = false;
  public form: FormGroup;
  error_message = '';
  public error: any;
  public client_id = 'f90aca17-a17b-4147-94a7-e91784e70c38';
  public cliente_secret = 'drupal';
  public dataCountry: any;
  public dataCity: any;
  public stringQuery = '';

  constructor(
    public Service: RegisterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {

    this.createForm();
    this.results = true;
    sessionStorage.clear();
    /* Método para los paises */
    this.Service.getCountryData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          this.dataCountry = this.response;
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      country: new FormControl('Seleccione el País'),
      city: new FormControl('Seleccione la Ciudad'),
      confirm: new FormControl(''),
      pass: new FormControl(''),
      term: new FormControl(''),
      recaptchaReactive: new FormControl(''),
    });
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-register').foundation();

    }
  }
  onSubmit(values) {

    var error = false;
    /* Se recibe los valores del login */
    if(values.pass !== values.confirm){

      $('#spanPass').removeClass('hide');
      error = true;
    }
    let payload = {
      "name": [
        {
          "value": values.email
        }
      ],
      "mail": [
        {
          "value": values.email
        }
      ],
      "field_user_phone": [
        {
          "value": values.phone
        }
      ],
      "pass": [
        {
          "value": values.confirm
        }
      ],
      "field_user_address": [
      ],
      "field_country":[
          {
              "target_id": values.country
          }
      ],
      "field_city":[
          {
              "target_id": values.city
          }
      ],
      "field_first_name": [
          {
              "value": values.name
          }
      ],
      "field_last_name": [
          {
              "value": values.lastname
          }
      ]

    }
    this.startSpinner();
    sessionStorage.setItem('username',values.email);
    sessionStorage.setItem('password',values.confirm);
    this.Service.RegisterRequest( payload )
    .subscribe(
      (data) => (this.response = data),
      err => (this.error = err),
      () => {
        if(this.response){
          console.log('respondio',this.response.uid);
          const uid = this.response.uid[0].value;
          sessionStorage.setItem('uid',uid);
          this.beforeRegister();
        }else{
          this.error_message = this.error._body.message
        }
      }
    );
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
  }
  beforeRegister(){
    var url = 'https://lab.estrenarvivienda.com/es/oauth/token';
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", this.client_id);
    urlencoded.append("client_secret", this.cliente_secret);
    urlencoded.append("username", sessionStorage.getItem('username'));
    urlencoded.append("password", sessionStorage.getItem('password'));
      fetch(url, {
        body: urlencoded,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        redirect: 'follow',
      })
      .then(function (a) {
          return a.json();
      })
     .then(result => {
       console.log('result',result)
       if(result.access_token){
        var now = new Date();
        now.setSeconds(now.getSeconds() + result.expires_in)
        var timeObject = {
          time : now
        };
         sessionStorage.setItem('access_token',result.access_token);
         sessionStorage.setItem('time_out',JSON.stringify(timeObject));
        //  localStorage.clear();
        this.stopSpinner();
         this.router.navigate(['/user']);

       }
      })
     .catch(error => {
        console.error(error);
      });
  }
  change(value) {
      this.stringQuery = "";
      this.stringQuery = value.country;
      var url = environment.endpointTestingApi + 'ubications/'+ this.stringQuery +'/cities?_format=json';
      var data = "";
      fetch(url, {
      })
      .then(response => response.json())
      .then(data => {
        this.response = data;
        if (this.response) {
          console.log(this.response);
          this.dataCity = this.response;
          this.results = true;
        }
      })
      .catch(error => console.error(error))
  }
  // metodos cargando
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
