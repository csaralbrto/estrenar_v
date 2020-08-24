import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  providers: [BlogService],
})
export class BlogComponent implements OnInit {
  public response: any;

  constructor(public Service: BlogService) {}

  ngOnInit(): void {
    $(document).foundation();
    /* Método para obtener toda la info del blog */
    this.Service.getBlogData().subscribe(
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

    /* Método para obtener toda la info de los más leidos */
    this.Service.mostRead().subscribe(
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

    /* Método para obtener toda la info de la experiencia de estrenar */
    this.Service.newExperience().subscribe(
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

    /* Método para obtener toda la info de el lado eco */
    this.Service.ecoSide().subscribe(
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

    /* Método para obtener toda la info de lo recomendado */
    this.Service.blogRecommended().subscribe(
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

    /* Método para obtener toda la info de noticias del sector */
    this.Service.blogNews().subscribe(
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
}
