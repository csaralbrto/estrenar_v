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
  public user_id = sessionStorage.getItem('uid');
  public token_logout = sessionStorage.getItem('token_logout');
  public path = "?_format=json";
  public results = false;
  public uid = "";
  public path_dataload = 'taxonomy_term/user_preferences?include=parent';
  public data : any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: UserService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.uid = this.user_id + this.path;
    this.beforeCheck();
    this.dataLoad();
  }
  beforeCheck(){
    /* Traemos la información del usuario */
    var url = environment.endpointTestingApiPost+ 'user/' + this.uid;
    var token = sessionStorage.getItem('access_token');
    var data = "";
    fetch(url, {
      headers: new Headers({
        'Authorization': 'Bearer '+token
      })
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
    })
    .catch(error => console.error(error))
  }
  dataLoad(){
    /* Traemos la información del usuario */
    var url = environment.endpointTestingApi + this.path_dataload;
    var token = sessionStorage.getItem('access_token');
    var data = "";
    fetch(url, {
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Host': 'lab.estrenarvivienda.com'
      })
    })
    .then(response => response.json())
    .then(data => {
      // thi
      console.log(data)

    })
    .catch(error => console.error(error))
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
  logoutUser() {
    /* Se recibe los valores del formulario */
    const uid_logout = this.path + '&token=' + this.token_logout;
    console.log(uid_logout);
    this.Service.updateDataUser(uid_logout)
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
