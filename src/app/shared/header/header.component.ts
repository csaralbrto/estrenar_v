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

  ngOnInit(): void {
    if(this.url_header){
      console.log(this.url_header);
      this.show_header = true;
    }else{
      this.show_white_header = true;
    }
  }
}
