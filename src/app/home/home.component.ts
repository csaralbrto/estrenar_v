import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from './home.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService],
})
export class HomeComponent implements OnInit {
  public response: any;
  public projects1: any;
  public projects2: any;
  public projects3: any;
  public results = false;

  constructor(public Service: HomeService) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  home = true;
  url_img_path = 'https://www.estrenarvivienda.com/';

  title_section_list_search = '¿Qué estás buscando?';
  title_section_top_proyects = 'Proyectos destacados';
  title_section_builders = 'Constructoras';
  title_section_blog = 'Blog';
  main_title_page = 'Te ayudamos a encontrar tu lugar ideal';

  ngOnInit(): void {
    // $('#welcomeModal').foundation('open');

    /* Método para obtener toda la info del home */
    this.Service.getAllData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          for (let project of this.response.home_featured_typologies) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
          }
          let count = 0;
          for (let project of this.response.home_featured_typologies) {
            if(count == 0){
              this.projects1 = project;
            }else if(count > 0 && count == 2){
              this.projects2 = project;
            }else if(count > 2 && count == 4){
              this.projects3 = project;
            }
            count = count +1;
          }
          console.log(this.projects2);
          this.results = true;
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-home').foundation();
    }
  }
}
