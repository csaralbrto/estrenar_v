import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from './blog.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

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
  public responseDekoSide: any;
  public responseNews: any;
  public results = false;
  url_img_path = 'https://www.estrenarvivienda.com/';
  public stringText: any;
  error_message = '';
  public error: any;

  constructor(public Service: BlogService,private spinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    // console.log("arranco");
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    this.startSpinner();
    /* Método para obtener toda la info del blog */
    this.stringText = '...';
    this.Service.getBlogData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {

          console.log(this.response);

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

          console.log('lo más relido',this.responseMostRead)
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
          console.log('la experiencia ',this.responseNewExperience)
          this.results = true;
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener toda la info de el lado deko */
    this.Service.dekoSide().subscribe(
      (data) => (this.responseDekoSide = data),
      (err) => console.log(),
      () => {
        if (this.responseDekoSide) {
          /* si responde correctamente */
          console.log('response responseDekoSide', this.responseDekoSide);
          for (let sideEco of this.responseDekoSide.results) {
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
    $('html,body').scrollTop(0);

  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-blog').foundation();
      // $('html,body').scrollTop(0);
      if ($('.slider-blog').length) {
        $('.slider-blog').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
          centerMode: true,
          centerPadding: '260px',
          slidesToShow: 1,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                dots: true,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            }
          ]
        });
      }
      if ($('.slider-blog-mobile').length) {
        $('.slider-blog-mobile').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      this.stopSpinner();

    }
  }
  subscribe(){
    this.startSpinner();
    if($('#email_subscribe').val() == "" || $('#email_subscribe').val() == null){
      $('#spanEmail').removeClass('hide');
    }
    if($("#checkbox1").is(":checked")){
      let email_subscribe = $('#email_subscribe').val();
      let payload = {
        "webform_id":"newsletter",
        "correo_electronico":email_subscribe,
      };
      this.Service.subscribeService( payload )
      .subscribe(
        (data) => (this.response = data),
        err => (this.error = err),
        () => {
          if(this.response){
            console.log(this.response);
            if(this.response.sid){
              this.stopSpinner();
              $('#exampleModalSuscribe').foundation('open');
              $('#email_subscribe').val('');
            }else{
              this.stopSpinner();
              $('#exampleModalNosuscribe').foundation('open');
            }
          }else{
            this.stopSpinner();
            $('#exampleModalNosuscribe').foundation('open');
            console.log(this.error);
            this.error_message = this.error._body.message
          }
        }
      );
    }else{
      $('#spanPass').removeClass('hide');
    }

  }
  // Metodos Cargando
  startSpinner(): void {
    if (this.spinnerService) {
      this.spinnerService.show();
    }
  }
  stopSpinner(): void {

    if (this.spinnerService) {
      // console.log("ingrese a parar");
      this.spinnerService.hide();
    }
  }
}
