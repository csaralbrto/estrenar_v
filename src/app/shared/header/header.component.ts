import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from './header.service';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() url_header: string;
  show_header = false
  show_white_header = false
  not_show_header = false
  url_location = "";
  public response: any;
  public filterPrice: any;
  public bannersImg: any;
  public xcsrfToken: any;
  public client_id = 'f90aca17-a17b-4147-94a7-e91784e70c38';
  public cliente_secret = 'drupal';
  constructor(
    private activatedRoute: ActivatedRoute,
    public Service: HeaderService,
    private router: Router,) {}

  name_company = 'Estrena Vivienda';
  menu_title_proyects = 'Proyectos';
  menu_title_house_VIS = 'Vivienda VIS';
  // menu_title_house_vacational = 'Vacacionales';
  menu_title_builders = 'Constructoras';
  menu_title_tools = 'Herramientas';
  menu_title_blog = 'Blog';
  number_persons = 5;
  path_user = "";
  path_favorites = "";
  number_favorites = 0;
  public path_api = environment.endpointTestingApi;

  ngOnInit(): void {
    this.url_location = window.location.pathname;
    if(this.url_location === '/home' || this.url_location === '/'){
      // console.log(this.url_header);
      this.show_header = true;
    }else if(this.url_location === '/wizard'){
      this.not_show_header = true;
      this.show_white_header = false;
      this.show_header = false;
    }else{
      this.show_white_header = true;
    }
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    // console.log('user_login-> ',user_login,'user_id-> ',user_uid)
    if(user_login === null || user_uid === null){
      this.path_user = "login";
      this.path_favorites = "login";
    }else{
      if(sessionStorage['favorite']){
        var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
        this.number_favorites = storedIds.length
      }
      this.path_user = "user";
      this.path_favorites = "favoritos";
    }
    /* Método para obtener toda la info del home */
    this.Service.getAllData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          if(this.response.price_ranges){
            // console.log('response header: ',this.response);
            this.filterPrice = this.response.price_ranges;
            this.bannersImg = this.response.home_banner
            // for (let prices of this.response.price_ranges) {
            //   console.log(prices.values.value)
            // }
          }
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  public onOptionsSelected(event) {
    const value = event.target.value;
    // this.selected = value;
    let url_price  = value.split("/es/api/");
    url_price = this.path_api + url_price[1];
    sessionStorage.removeItem('price_search');
    sessionStorage.setItem('price_search',url_price)
    this.router.navigate(['/proyectos']);
    this.show_white_header = true;
    this.show_header = false;
  }
  ngAfterViewChecked() {
    // if ($('.slider-header').length) {
    // $('.slider-header').slick({
    //   // dots: true,
    //   autoplay: true,
    //   autoplaySpeed: 5000,
    // });
    // }
  }
  ngAfterContentChecked() {
    const user_login2 = sessionStorage.getItem('access_token');
    const user_uid2 = sessionStorage.getItem('uid');
    // console.log('user_login-> ',user_login,'user_id-> ',user_uid)
    if(user_login2 === null || user_uid2 === null){
      this.path_user = "login";
      this.path_favorites = "login";
    }else{
      if(sessionStorage['favorite']){
        var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
        this.number_favorites = storedIds.length
      }
      this.path_user = "user";
      this.path_favorites = "favoritos";
    }
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
          $(".header").addClass("header-fix");
        } else {
          $(".header").removeClass("header-fix");
        }
    });
    this.url_location = window.location.pathname;
    if(this.url_location === '/home' || this.url_location === '/'){
      // console.log(this.url_header);
      this.show_header = true;
      this.show_white_header = false;
    }else if(this.url_location === '/wizard'){
      this.not_show_header = true;
      this.show_white_header = false;
      this.show_header = false;
    }else{
      this.show_white_header = true;
      this.show_header = false;
    }
    $('.slider-header').not('.slick-initialized').slick({
      // dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
    });
  }
  public searchWord(){
    var searchWord = $('#searchWord').val();
    sessionStorage.removeItem('word_search');
    sessionStorage.removeItem('wordTitle');
    sessionStorage.setItem('word_search',searchWord)
    sessionStorage.setItem('wordTitle',searchWord)
    this.router.navigate(['/proyectos']);
    this.show_white_header = true;
    this.show_header = false;
  }
  public searchInput(){
    $('#searchProjectsWord').toggleClass('hide');
  }
  public findByWord(){
    var searchWord = $('#searchProjectsWord').val();
    sessionStorage.removeItem('word_search');
    sessionStorage.setItem('word_search',searchWord)
    this.router.navigate(['/proyectos']);
    this.show_white_header = true;
    this.show_header = false;
  }
  updateFAvorites() {
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
      fetch("https://lab.estrenarvivienda.com/es/session/token")
      .then(response => response.text())
      .then(result => {
        this.xcsrfToken = result
        console.log('voy a before update');
        this.beforeUpdate(this.xcsrfToken, payload);
      })
      .catch(error => console.log('error', error));
   }
  }
  beforeUpdate(xcsrfToken, payload){
    var url = 'https://lab.estrenarvivienda.com/es/oauth/token';
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", this.client_id);
    urlencoded.append("client_secret", this.cliente_secret);
    urlencoded.append("username", this.cliente_secret);
    urlencoded.append("password", this.cliente_secret);
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
         console.log('voy a update user');
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
    let url = 'https://lab.estrenarvivienda.com/es/user/';
    let url_last = '?_format=json';

    fetch(url + sessionStorage.getItem('uid') + url_last, {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.text())
      .then(result =>{ 
        console.log(result)
        this.router.navigate(['/favoritos']);
      })
      .catch(error => console.log('error', error));
  }
}
