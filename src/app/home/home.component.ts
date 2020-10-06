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
  public results = false;

  constructor(public Service: HomeService) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  home = true;

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
          for (let blog of this.response.home_featured_articles) {
            console.log(blog);
          }
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
