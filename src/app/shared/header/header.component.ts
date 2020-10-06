import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(
    private activatedRoute: ActivatedRoute,) {}

  name_company = 'Estrena Vivienda';
  menu_title_proyects = 'Proyectos';
  menu_title_house_VIS = 'Vivienda VIS';
  // menu_title_house_vacational = 'Vacacionales';
  menu_title_builders = 'Constructoras';
  menu_title_tools = 'Herramientas';
  menu_title_blog = 'Blog';
  number_persons = 5;
  path_user = "";

  ngOnInit(): void {
    this.url_location = window.location.pathname;
    if(this.url_location === '/home' || this.url_location === '/'){
      console.log(this.url_header);
      this.show_header = true;
    }else if(this.url_location === '/wizard'){
      this.not_show_header = true;
      this.show_white_header = false;
      this.show_header = false;
    }else{
      this.show_white_header = true;
    }
    const user_login = sessionStorage.getItem('access_token');
    if(user_login === null){
      this.path_user = "login";
    }else{
      this.path_user = "user";
    }
  }
}
