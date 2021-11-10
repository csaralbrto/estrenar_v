import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './login.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { CookieXSRFStrategy } from '@angular/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public response: any;
  public results = false;
  public form: FormGroup;
  error_message = '';
  public error: any;
  public client_id = '21f24499-5493-4609-b204-f9181350de5d';
  public cliente_secret = 'drupal';

  constructor(
    public Service: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.startSpinner();
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    $('.ev--bots').addClass('hide');
    this.createForm();
    this.results = true;
    sessionStorage.clear();
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-login').foundation();
      this.stopSpinner();
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      pass: new FormControl(''),
    });
  }
  onSubmit(values) {
    /* Se recibe los valores del login */
    console.log(values)
    sessionStorage.setItem('username',values.name);
    sessionStorage.setItem('password',values.pass);
    this.Service.loginRequest( values )
    .subscribe(
      (data) => (this.response = data),
      err => (this.error = err),
      () => {
        if(this.response){
          console.log('respondio',this.response);
          const uid = this.response.current_user.uid
          sessionStorage.setItem('uid',uid);
          // $('#modalAlertSuccessful').foundation('open');
          if(this.response.current_user.uid){
            this.form.reset();
            // this.router.navigate(['/']);
            this.beforeLogin();
          }
        }else{
          this.error_message = this.error._body.message
        }
      }
    );
  }
  beforeLogin(){
    var url = 'https://lab.estrenarvivienda.com/oauth/token';
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
        //  sessionStorage.clear();

         this.router.navigate(['/user']);

       }
      })
     .catch(error => {
        console.error(error);
      });
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
