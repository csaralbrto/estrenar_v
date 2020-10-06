import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  providers: [BlogService],
})
export class BlogComponent implements OnInit, AfterViewChecked {
  public response: any;
  dataArticle = '?include=uid,field_article_type,field_media.field_media_image,field_tags';
  public responseNewExperience: any;
  public responseMostRead: any;
  public responseRecommend: any;
  public responseEcoSide: any;
  public responseNews: any;
  public results = false;
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor(public Service: BlogService) {}

  ngOnInit(): void {
    /* Método para obtener toda la info del blog */
    this.Service.getBlogData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de los más leidos */
    this.Service.mostRead().subscribe(
      (data) => (this.responseMostRead = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de la experiencia de estrenar */
    this.Service.newExperience().subscribe(
      (data) => (this.responseNewExperience = data),
      (err) => console.log(),
      () => {
        if (this.responseNewExperience) {
          /* si responde correctamente */
          this.results = true;
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de el lado eco */
    this.Service.ecoSide().subscribe(
      (data) => (this.responseEcoSide = data),
      (err) => console.log(),
      () => {
        if (this.responseEcoSide) {
          /* si responde correctamente */
          console.log('response new experience', this.responseEcoSide);
          for (let sideEco of this.responseEcoSide.results) {
            sideEco.article_image = sideEco.article_image.split(",",1); 
          }
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de lo recomendado */
    this.Service.blogRecommended().subscribe(
      (data) => (this.responseRecommend = data),
      (err) => console.log(),
      () => {
        if (this.response.successful) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de noticias del sector */
    this.Service.blogNews().subscribe(
      (data) => (this.responseNews = data),
      (err) => console.log(),
      () => {
        if (this.response.successful) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de articulo relacionado */
    this.Service.blogRelated().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response.successful) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }

  ngAfterViewChecked() {
    if (this.results) {
      $('app-blog').foundation();
      $('html,body').scrollTop(0);
    }
  }
}
