import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { UserService } from './user.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService],
})
export class UserComponent implements OnInit {
  public response: any;
  public dataSubmit: any;
  public user_id = localStorage.getItem('uid');
  public token_logout = localStorage.getItem('token_logout');
  public path = "?_format=json";
  public results = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: UserService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    const uid = this.user_id + this.path;
    console.log(uid);
    this.Service.userData(uid).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log('entre a mostrar ',this.response);
          this.results = true;
        }
      }
    );
  }
  onSubmit(values) {
    const uid_update = this.user_id + this.path;
    console.log(uid_update);
    this.Service.updateDataUser( values )
    .subscribe(
      data =>(this.response = data),
      err => console.log(err),
      () => {
        // if(this){
        //   // $('#modalAlertSuccessful').foundation('open');
        //   this.form.reset();
        // }
        // if(this.confirm.error){
        //   // $('#modalAlertError').foundation('open');
        // }
      }
    );
  }
  logoutUser(values) {
    /* Se recibe los valores del formulario */
    const uid = this.path + '&token=' + this.token_logout;
    console.log(uid);
    this.Service.updateDataUser( values )
    .subscribe(
      data =>(this.response = data),
      err => console.log(err),
      () => {
        // if(this){
        //   // $('#modalAlertSuccessful').foundation('open');
        //   this.form.reset();
        // }
        // if(this.confirm.error){
        //   // $('#modalAlertError').foundation('open');
        // }
      }
    );
  }

}
