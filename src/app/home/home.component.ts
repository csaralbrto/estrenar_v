import { Component, OnInit } from '@angular/core';
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

  constructor(public Service: HomeService) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';

  title_section_list_search = '¿Qué estás buscando?';
  title_section_top_proyects = 'Proyectos destacados';
  title_section_builders = 'Constructoras';
  title_section_blog = 'Blog';
  main_title_page = 'Te ayudamos a encontrar tu lugar ideal';

  ngOnInit(): void {
    $(document).foundation();
    $('#welcomeModal').foundation('open');

    /* Método para obtener toda la info del home */
    this.Service.getAllData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response.blogs);
          for (let blog of this.response.blogs) {
            this.largo = blog.banner.length;
            this.cadena = blog.banner.substr(43, this.largo);
            blog.banner = this.dataPath + this.cadena;
          }
          for (let constructora of this.response.constructoras) {
            if (constructora.logo) {
              this.largo = constructora.logo.length;
              this.cadena = constructora.logo.substr(43, this.largo);
              constructora.logo = this.dataPath + this.cadena;
            }
          }
          for (let project of this.response.projects) {
            if (project.imagen_banner) {
              this.largo = project.imagen_banner.length;
              this.cadena = project.imagen_banner.substr(43, this.largo);
              project.imagen_banner = this.dataPath + this.cadena;
            }
          }
          for (let header_proj1 of this.response.header_proj1) {
            if (header_proj1.url_img) {
              this.largo = header_proj1.url_img.length;
              this.cadena = header_proj1.url_img.substr(43, this.largo);
              header_proj1.url_img = this.dataPath + this.cadena;
            }
          }
          for (let header_proj2 of this.response.header_proj2) {
            if (header_proj2.url_img) {
              this.largo = header_proj2.url_img.length;
              this.cadena = header_proj2.url_img.substr(43, this.largo);
              header_proj2.url_img = this.dataPath + this.cadena;
            }
          }
          for (let header_proj3 of this.response.header_proj3) {
            if (header_proj3.url_img) {
              this.largo = header_proj3.url_img.length;
              this.cadena = header_proj3.url_img.substr(43, this.largo);
              header_proj3.url_img = this.dataPath + this.cadena;
            }
          }
          for (let header_proj4 of this.response.header_proj4) {
            if (header_proj4.url_img) {
              this.largo = header_proj4.url_img.length;
              this.cadena = header_proj4.url_img.substr(43, this.largo);
              header_proj4.url_img = this.dataPath + this.cadena;
            }
          }
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
}
