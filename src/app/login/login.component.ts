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

  constructor( 
    public Service: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.createForm();
    this.results = true;
    localStorage.clear();
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
    localStorage.setItem('user_name',values.name);
    localStorage.setItem('password',values.pass);
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
    // var data = 'grant_type=password&client_id=1431780a-8799-4f29-9715-bfd6d03f7cc4&client_secret=estrenar&username='+localStorage.getItem('user_name')+'&password='+localStorage.getItem('password');
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "1431780a-8799-4f29-9715-bfd6d03f7cc4");
    urlencoded.append("client_secret", "estrenar");
    urlencoded.append("username", localStorage.getItem('user_name'));
    urlencoded.append("password", localStorage.getItem('password'));
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
         sessionStorage.setItem('username',localStorage.getItem('user_name'));
         sessionStorage.setItem('password',localStorage.getItem('password'));
         localStorage.clear();

         this.router.navigate(['/']);

       }
      })
     .catch(error => {
        console.error(error);
      });
  }

}
