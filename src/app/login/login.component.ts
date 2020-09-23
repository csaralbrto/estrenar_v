import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './login.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

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

  constructor( 
    public Service: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.createForm();
    this.results = true;
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
    this.Service.loginRequest( values )
    .subscribe(
      (data) => (this.response = data),
      err => console.log(err),
      () => {
        if(this.response){
          // $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
          localStorage.setItem('uid',this.response.current_user.uid);
          localStorage.setItem('name_user ',this.response.current_user.name);
          localStorage.setItem('csrf_token',this.response.csrf_token);
          localStorage.setItem('token_logout',this.response.logout_token);
        }
        if(this.response.error){
          // $('#modalAlertError').foundation('open');
        }
      }
    );
  }

}
