import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { UserService } from './user.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService],
})
export class UserComponent implements OnInit {
  public response: any;
  public responseCountry: any;
  public dataSubmit: any;
  public form: FormGroup;
  public user_id = sessionStorage.getItem('uid');
  public user_role = sessionStorage['role']?sessionStorage.getItem("role"):null;
  public token_logout = sessionStorage.getItem('token_logout');
  public path = "?_format=json";
  public results = false;
  public uid = "";
  public path_dataload = 'taxonomy_term/user_preferences?include=parent';
  public data : any;
  public dataCountry: any;
  public dataCity: any;
  public stringQuery = '';
  public responseSubsidioData: any;
  public userSubsidioData: any;
  public responseTiempoData: any;
  public userTiempoData: any;
  public responseContactadoData: any;
  public userContactadoData: any;
  public responseViviendaData: any;
  public responseRole: any;
  public userViviendaData: any;
  public responsePresupuestoData: any;
  public userPresupuestoData: any;
  public preferencesUser: any;
  public xcsrfToken: any;
  public error: any;
  public client_id = '21f24499-5493-4609-b204-f9181350de5d';
  public cliente_secret = 'drupal';
  arrayOptions: string[] = [];
  arrayOptions2: string[] = [];
  error_message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: UserService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.startSpinner();
    this.uid = this.user_id + this.path;
    $('.ev--bots').addClass('hide');
    this.createForm();
    this.beforeCheck();
    this.dataLoad();
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
      console.log(data)
      this.response = data;
      if(this.response.field_user_preference){
        this.preferencesUser = this.response.field_user_preference;
        console.log(this.preferencesUser)
        /* Método para obtener toda la info subsidio */
        this.Service.getDataSubsidio().subscribe(
          (data) => (this.responseSubsidioData = data.data),
          (err) => console.log(),
          () => {
            if (this.responseSubsidioData) {
              if(this.preferencesUser){
                for (let subsidio of this.responseSubsidioData) {
                  for (let preference of this.preferencesUser) {
                    if(subsidio.drupal_internal__tid == preference.target_id){
                      this.userSubsidioData = preference.target_id;
                      this.form.controls.subsidy.setValue(this.userSubsidioData);
                    }
                  }
                }
              }
            }
            /* si responde correctamente */
            if (this.responseSubsidioData.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        /* Método para obtener toda la info de tiempos */
        this.Service.getDataTiempo().subscribe(
          (data) => (this.responseTiempoData = data.data),
          (err) => console.log(),
          () => {
            if (this.responseTiempoData) {
              // console.log('preferencias del usuario: ',this.preferencesUser);
              // console.log('tiempo para habitar: ',this.responseTiempoData);
              if(this.preferencesUser){
                for (let tiempo of this.responseTiempoData) {
                  for (let preference of this.preferencesUser) {
                    if(tiempo.drupal_internal__tid == preference.target_id){
                      this.userTiempoData = preference.target_id;
                      this.form.controls.time_buy.setValue(this.userTiempoData);
                    }
                  }
                }
              }
              // console.log('tiempo de habitar valor: ',this.userTiempoData);
            }
            /* si responde correctamente */
            if (this.responseTiempoData.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        /* Método para obtener toda la info de presupuesto */
        this.Service.getDataPresupuesto().subscribe(
          (data) => (this.responsePresupuestoData = data.data),
          (err) => console.log(),
          () => {
            if (this.responsePresupuestoData) {
              // console.log(this.responsePresupuestoData);
              if(this.preferencesUser){
                for (let presupuesto of this.responsePresupuestoData) {
                  for (let preference of this.preferencesUser) {
                    if(presupuesto.drupal_internal__tid == preference.target_id){
                      this.userPresupuestoData = preference.target_id;
                      this.form.controls.budget.setValue(this.userPresupuestoData);
                    }
                  }
                }
              }
            }
            /* si responde correctamente */
            if (this.responsePresupuestoData.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        // /* Método para obtener toda la info de ser contactado */
        this.Service.getDataContacado().subscribe(
          (data) => (this.responseContactadoData = data.data),
          (err) => console.log(),
          () => {
            if (this.responseContactadoData) {
              if (this.preferencesUser) {
                for (let contactado of this.responseContactadoData) {
                  for (let preference of this.preferencesUser) {
                    if(contactado.drupal_internal__tid == preference.target_id){
                      this.userContactadoData = preference.target_id;
                      this.form.controls.contact.setValue(this.userContactadoData);
                    }
                  }
                }
              }
              // console.log(this.arrayOptions);
              this.results = true;
            }
            /* si responde correctamente */
            if (this.responseContactadoData.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        // /* Método para obtener toda la info de vivienda */
        this.Service.getDataVivienda().subscribe(
          (data) => (this.responseViviendaData = data.data),
          (err) => console.log(),
          () => {
            if (this.responseViviendaData) {
              if(this.preferencesUser){
                for (let vivienda of this.responseViviendaData) {
                  for (let preference of this.preferencesUser) {
                    if(vivienda.drupal_internal__tid == preference.target_id){
                      this.userViviendaData = preference.target_id;
                      this.form.controls.search_house.setValue(this.userViviendaData);
                    }
                  }
                }
              }
              this.results = true;
            }
            /* si responde correctamente */
            if (this.responseViviendaData.error) {
              /* si hay error en la respuesta */
            }
          }
        );
        /* Método para cargar el role */
        // this.Service.getRoleData().subscribe(
        //   (data) => (this.responseRole = data.data),
        //   (err) => console.log(),
        //   () => {
        //     if (this.responseRole) {
        //       console.log(this.responseRole);
        //       this.results = true;
        //     }
        //     /* si responde correctamente */
        //     if (this.responseRole.error) {
        //       /* si hay error en la respuesta */
        //     }
        //   }
        // );
        /* Asignamos el valor al formulario */
        this.form.controls.name.setValue(this.response.field_first_name[0].value);
        this.form.controls.lastname.setValue(this.response.field_last_name[0].value);
        this.form.controls.email.setValue(this.response.mail[0].value);
        this.form.controls.phone.setValue(this.response.field_user_phone[0].value);
        this.form.controls.country.setValue(this.response.field_country[0].target_id);
        this.form.controls.city.setValue(this.response.field_city[0].target_id);
        if(this.response.field_country[0].target_id){
          this.change(this.response.field_country[0].target_id);
        }
        // this.form.controls.zone.setValue(this.response.);
        // if(this.userPresupuestoData){
        //   this.form.controls.budget.setValue(this.userPresupuestoData);
        // }
        // if(this.userSubsidioData){
        //   this.form.controls.subsidy.setValue(this.userSubsidioData);
        // }
        // if(this.userTiempoData){
        //   this.form.controls.time_buy.setValue(this.userTiempoData);
        // }
        // if(this.userViviendaData){
        //   this.form.controls.search_house.setValue(this.userViviendaData);
        // }
        // if(this.userContactadoData){
        //   this.form.controls.contact.setValue(this.userContactadoData);
        // }
        this.stopSpinner();
      }else{
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
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
      // console.log(data)

    })
    .catch(error => console.error(error))
  }
  onSubmit(values) {
    this.startSpinner();
    let password = "";
    let payload : any;
    console.log(values);
    if(values.confirm){
      password = values.confirm
      payload = {
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
            "value": password
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
        ],
        "field_user_preference": [
          {"target_id": (values.budget)?values.budget:""},
          {"target_id": (values.subsidy)?values.subsidy:""},
          {"target_id": (values.time_buy)?values.time_buy:""},
          {"target_id": (values.search_house)?values.search_house:""},
          {"target_id": (values.contact)?values.contact:""}
        ],
        // "field_user_preference_location": [
        //   {"target_id": (values.zone)?values.zone:""}
        // ],
      }
    }else{
      password = sessionStorage.getItem('password');
      payload = {
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
        ],
        "field_user_preference": [
          {"target_id": (values.budget)?values.budget:""},
          {"target_id": (values.subsidy)?values.subsidy:""},
          {"target_id": (values.time_buy)?values.time_buy:""},
          {"target_id": (values.search_house)?values.search_house:""},
          {"target_id": (values.contact)?values.contact:""}
        ],
        // "field_user_preference_location": [
        //   {"target_id": (values.zone)?values.zone:""}
        // ],
      }
    }
    console.log(payload);
    fetch("https://lab.estrenarvivienda.com/session/token")
    .then(response => response.text())
    .then(result => {
      this.xcsrfToken = result
      console.log('voy a before update');
      this.beforeUpdate(this.xcsrfToken, payload);
    })
    .catch(error => console.log('error', error));
  }
  updateFavorites() {
    if(sessionStorage['favorite']){
      let favorites = [];
      var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
      let count = 0
      for (let ids of storedIds) {
        favorites.push({"target_id": ids})
      }
      let payload = {
      "field_user_favorites": favorites
      }
      this.router.navigate(['/favoritos']);
      // fetch("https://lab.estrenarvivienda.com/es/session/token")
      // .then(response => response.text())
      // .then(result => {
      //   this.xcsrfToken = result
      //   console.log('voy a before update');
      //   this.beforeUpdate(this.xcsrfToken, payload);
      // })
      // .catch(error => console.log('error', error));
   }
  }
  beforeUpdate(xcsrfToken, payload){
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
         localStorage.removeItem('access_token');
         sessionStorage.setItem('access_token',result.access_token);
         localStorage.removeItem('time_out');
         sessionStorage.setItem('time_out',JSON.stringify(timeObject));
        //  console.log('voy a update user');
         this.updateUser(xcsrfToken, payload);

       }
      })
     .catch(error => {
        console.error(error);
      });
  }
  updateUser(xcsrfToken, payload){
    console.log('entre a update user',xcsrfToken);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-CSRF-Token", xcsrfToken);
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('access_token'));
    var raw = JSON.stringify(payload);
    let url = 'https://lab.estrenarvivienda.com/user/';
    let url_last = '?_format=json';

    fetch(url + sessionStorage.getItem('uid') + url_last, {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.json())
      .then(result =>{
        // console.log(result)
        this.response = result;
        if(this.response.field_user_preference){
          this.preferencesUser = this.response.field_user_preference;
          // console.log(this.preferencesUser)
          /* Método para obtener toda la info subsidio */
          this.Service.getDataSubsidio().subscribe(
            (data) => (this.responseSubsidioData = data.data),
            (err) => console.log(),
            () => {
              if (this.responseSubsidioData) {
                if(this.preferencesUser){
                  for (let subsidio of this.responseSubsidioData) {
                    for (let preference of this.preferencesUser) {
                      if(subsidio.drupal_internal__tid == preference.target_id){
                        this.userSubsidioData = preference.target_id;
                        this.form.controls.subsidy.setValue(this.userSubsidioData);
                      }
                    }
                  }
                }
              }
              /* si responde correctamente */
              if (this.responseSubsidioData.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          /* Método para obtener toda la info de tiempos */
          this.Service.getDataTiempo().subscribe(
            (data) => (this.responseTiempoData = data.data),
            (err) => console.log(),
            () => {
              if (this.responseTiempoData) {
                // console.log('preferencias del usuario: ',this.preferencesUser);
                // console.log('tiempo para habitar: ',this.responseTiempoData);
                if(this.preferencesUser){
                  for (let tiempo of this.responseTiempoData) {
                    for (let preference of this.preferencesUser) {
                      if(tiempo.drupal_internal__tid == preference.target_id){
                        this.userTiempoData = preference.target_id;
                        this.form.controls.time_buy.setValue(this.userTiempoData);
                        // console.log('tiempo de habitar valor: ',this.userTiempoData);
                      }
                    }
                  }
                }
              }
              /* si responde correctamente */
              if (this.responseTiempoData.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          /* Método para obtener toda la info de presupuesto */
          this.Service.getDataPresupuesto().subscribe(
            (data) => (this.responsePresupuestoData = data.data),
            (err) => console.log(),
            () => {
              if (this.responsePresupuestoData) {
                // console.log(this.responsePresupuestoData);
                if(this.preferencesUser){
                  for (let presupuesto of this.responsePresupuestoData) {
                    for (let preference of this.preferencesUser) {
                      if(presupuesto.drupal_internal__tid == preference.target_id){
                        this.userPresupuestoData = preference.target_id;
                        this.form.controls.budget.setValue(this.userPresupuestoData);
                      }
                    }
                  }
                }
              }
              /* si responde correctamente */
              if (this.responsePresupuestoData.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          // /* Método para obtener toda la info de ser contactado */
          this.Service.getDataContacado().subscribe(
            (data) => (this.responseContactadoData = data.data),
            (err) => console.log(),
            () => {
              if (this.responseContactadoData) {
                if (this.preferencesUser) {
                  for (let contactado of this.responseContactadoData) {
                    for (let preference of this.preferencesUser) {
                      if(contactado.drupal_internal__tid == preference.target_id){
                        this.userContactadoData = preference.target_id;
                        this.form.controls.contact.setValue(this.userContactadoData);
                      }
                    }
                  }
                }
                // console.log(this.arrayOptions);
                this.results = true;
              }
              /* si responde correctamente */
              if (this.responseContactadoData.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          // /* Método para obtener toda la info de vivienda */
          this.Service.getDataVivienda().subscribe(
            (data) => (this.responseViviendaData = data.data),
            (err) => console.log(),
            () => {
              if (this.responseViviendaData) {
                if(this.preferencesUser){
                  for (let vivienda of this.responseViviendaData) {
                    for (let preference of this.preferencesUser) {
                      if(vivienda.drupal_internal__tid == preference.target_id){
                        this.userViviendaData = preference.target_id;
                        this.form.controls.search_house.setValue(this.userViviendaData);
                      }
                    }
                  }
                }
                this.results = true;
              }
              /* si responde correctamente */
              if (this.responseViviendaData.error) {
                /* si hay error en la respuesta */
              }
            }
          );
          /* Método para cargar el role */
          // this.Service.getRoleData().subscribe(
          //   (data) => (this.responseRole = data.data),
          //   (err) => console.log(),
          //   () => {
          //     if (this.responseRole) {
          //       console.log(this.responseRole);
          //       this.results = true;
          //     }
          //     /* si responde correctamente */
          //     if (this.responseRole.error) {
          //       /* si hay error en la respuesta */
          //     }
          //   }
          // );
          /* Asignamos el valor al formulario */
          this.form.controls.name.setValue(this.response.field_first_name[0].value);
          this.form.controls.lastname.setValue(this.response.field_last_name[0].value);
          this.form.controls.email.setValue(this.response.mail[0].value);
          this.form.controls.phone.setValue(this.response.field_user_phone[0].value);
          this.form.controls.country.setValue(this.response.field_country[0].target_id);
          this.form.controls.city.setValue(this.response.field_city[0].target_id);
          if(this.response.field_country[0].target_id){
            this.change(this.response.field_country[0].target_id);
          }
          // this.form.controls.zone.setValue(this.response.);
          // if(this.userPresupuestoData){
          //   this.form.controls.budget.setValue(this.userPresupuestoData);
          // }
          // if(this.userSubsidioData){
          //   this.form.controls.subsidy.setValue(this.userSubsidioData);
          // }
          // if(this.userTiempoData){
          //   this.form.controls.time_buy.setValue(this.userTiempoData);
          // }
          // if(this.userViviendaData){
          //   this.form.controls.search_house.setValue(this.userViviendaData);
          // }
          // if(this.userContactadoData){
          //   this.form.controls.contact.setValue(this.userContactadoData);
          // }
          this.stopSpinner();
        }
      })
      .catch(error => console.log('error', error));
  }
  logoutUser() {
    /* Cerramos sesión */

    sessionStorage.clear();
    this.router.navigate(['/home']);
    // var url = environment.endpointTestingApiPost+ 'user/logout?_format=json';
    // var token = sessionStorage.getItem('access_token');
    // var data = "";
    // fetch(url, {
    //   headers: new Headers({
    //     'Authorization': 'Bearer '+token
    //   })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // console.log(data)
    //   sessionStorage.clear();
    //    this.router.navigate(['/']);
    // })
    // .catch(error => console.error(error))
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      country: new FormControl('Seleccione'),
      city: new FormControl('Seleccione'),
      zone: new FormControl(''),
      budget: new FormControl('Seleccione'),
      subsidy: new FormControl('Seleccione'),
      time_buy: new FormControl('Seleccione'),
      search_house: new FormControl(''),
      contact: new FormControl(''),
      pass_actual: new FormControl(''),
      pass: new FormControl(''),
      confirm: new FormControl(''),
      // recaptchaReactive: new FormControl(''),
    });
  }
  change(value) {
      this.stringQuery = "";
      this.stringQuery = (value.country)?value.country:value;
      var url = environment.endpointTestingApi + 'ubications/'+ this.stringQuery +'/cities?_format=json';
      var data = "";
      fetch(url, {
      })
      .then(response => response.json())
      .then(data => {
        this.responseCountry = data;
        if (this.responseCountry) {
          console.log(this.responseCountry);
          this.dataCity = this.responseCountry;
          this.results = true;
        }
      })
      .catch(error => console.error(error))
  }
  startSpinner(): void {
    if (this.spinnerService) {
      // console.log("ingreso spinner..");
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
