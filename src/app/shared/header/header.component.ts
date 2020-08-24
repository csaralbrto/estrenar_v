import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  name_company = 'Estrena Vivienda';
  menu_title_proyects = 'Proyectos';
  menu_title_house_VIS = 'Vivienda VIS';
  // menu_title_house_vacational = 'Vacacionales';
  menu_title_builders = 'Constructoras';
  menu_title_tools = 'Herramientas';
  menu_title_blog = 'Blog';
  number_persons = 5;

  ngOnInit(): void {}
}
