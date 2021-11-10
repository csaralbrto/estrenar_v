import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ForgotPasswordService } from './forgot-password.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public response: any;
  public results = false;
  public form: FormGroup;
  public form2: FormGroup;
  public stringQuery = '';
  public token = null;

  constructor(
    public Service: ForgotPasswordService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {

    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    var url_string = window.location.href;
    var url = new URL(url_string);
    let token_parameter = url.searchParams.get("token");
    if(token_parameter === null){
      this.createForm();
      this.token = null;
    }else{
      this.createForm2();
      this.token = token_parameter;
    }

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
  createForm2() {
    this.form2 =  this.formBuilder.group({
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
      $('app-forgot-password').foundation();
    }
  }
  onSubmit(values) {
    // var error = false;
    // /* Se recibe los valores del login */
    // if(values.pass !== values.confirm){
    //   $('#spanPass').removeClass('hide');
    //   error = true;
    // }
    // let payload = {
    //   "name": [
    //     {
    //       "value": values.email
    //     }
    //   ],
    //   "mail": [
    //     {
    //       "value": values.email
    //     }
    //   ],
    //   "field_user_phone": [
    //     {
    //       "value": values.phone
    //     }
    //   ],
    //   "pass": [
    //     {
    //       "value": values.confirm
    //     }
    //   ],
    //   "field_user_address": [
    //   ],
    //   "field_country":[
    //       {
    //           "target_id": values.country
    //       }
    //   ],
    //   "field_city":[
    //       {
    //           "target_id": values.city
    //       }
    //   ],
    //   "field_first_name": [
    //       {
    //           "value": values.name
    //       }
    //   ],
    //   "field_last_name": [
    //       {
    //           "value": values.lastname
    //       }
    //   ]

    // }
    // sessionStorage.setItem('username',values.email);
    // sessionStorage.setItem('password',values.confirm);
    // this.Service.RegisterRequest( payload )
    // .subscribe(
    //   (data) => (this.response = data),
    //   err => (this.error = err),
    //   () => {
    //     if(this.response){
    //       console.log('respondio',this.response.uid);
    //       const uid = this.response.uid[0].value;
    //       sessionStorage.setItem('uid',uid);
    //       this.beforeRegister();
    //     }else{
    //       this.error_message = this.error._body.message
    //     }
    //   }
    // );
  }
  onSubmit2(values) {
    // var error = false;
    // /* Se recibe los valores del login */
    // if(values.pass !== values.confirm){
    //   $('#spanPass').removeClass('hide');
    //   error = true;
    // }
    // let payload = {
    //   "name": [
    //     {
    //       "value": values.email
    //     }
    //   ],
    //   "mail": [
    //     {
    //       "value": values.email
    //     }
    //   ],
    //   "field_user_phone": [
    //     {
    //       "value": values.phone
    //     }
    //   ],
    //   "pass": [
    //     {
    //       "value": values.confirm
    //     }
    //   ],
    //   "field_user_address": [
    //   ],
    //   "field_country":[
    //       {
    //           "target_id": values.country
    //       }
    //   ],
    //   "field_city":[
    //       {
    //           "target_id": values.city
    //       }
    //   ],
    //   "field_first_name": [
    //       {
    //           "value": values.name
    //       }
    //   ],
    //   "field_last_name": [
    //       {
    //           "value": values.lastname
    //       }
    //   ]

    // }
    // sessionStorage.setItem('username',values.email);
    // sessionStorage.setItem('password',values.confirm);
    // this.Service.RegisterRequest( payload )
    // .subscribe(
    //   (data) => (this.response = data),
    //   err => (this.error = err),
    //   () => {
    //     if(this.response){
    //       console.log('respondio',this.response.uid);
    //       const uid = this.response.uid[0].value;
    //       sessionStorage.setItem('uid',uid);
    //       this.beforeRegister();
    //     }else{
    //       this.error_message = this.error._body.message
    //     }
    //   }
    // );
  }

}
