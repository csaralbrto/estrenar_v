import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from './header.service';
import { environment } from '../../../environments/environment';

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
    }else{
      this.path_user = "user";
    }
    /* Método para obtener toda la info del home */
    this.Service.getAllData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          if(this.response.price_ranges){
            this.filterPrice = this.response.price_ranges;
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
}
