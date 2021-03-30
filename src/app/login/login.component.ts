import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './login.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { CookieXSRFStrategy } from '@angular/http';

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
  public client_id = 'f90aca17-a17b-4147-94a7-e91784e70c38';
  public cliente_secret = 'drupal';

  constructor( 
    public Service: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.createForm();
    this.results = true;
    sessionStorage.clear();
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-login').foundation();
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
    var url = 'https://lab.estrenarvivienda.com/es/oauth/token';
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", this.client_id);
    urlencoded.append("client_secret", this.cliente_secret);
    urlencoded.append("username", sessionStorage.getItem('user_name'));
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

         this.router.navigate(['/']);

       }
      })
     .catch(error => {
        console.error(error);
      });
  }

}
