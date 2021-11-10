import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { BlogDetailService } from './blog-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { data } from 'jquery';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  providers: [BlogDetailService],
})
export class BlogDetailComponent implements OnInit {
  dataArticle = '?include=uid,field_article_type,field_media.field_media_image,field_tags';
  tags: MetaTag;
  public responseAll: any;
  public response: any;
  public responseNewslaetter: any;
  public responseComments: any;
  public responseComment: any;
  public dataSubmit: any;
  public entity_id: any;
  public entity_type: any;
  public responseRelated: any;
  public form: FormGroup;
  public form2: FormGroup;
  public urlComments = 'https://lab.estrenarvivienda.com/api/comment/comment?filter[entity_id.id]=';
  public results = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: BlogDetailService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private spinnerService: NgxSpinnerService
  ) {}

  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {
    $('#exampleModalComment').addClass('hide');
    this.startSpinner();
    this.createForm();
    this.createFormSuscribe()
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');

    // const title = this.activatedRoute.snapshot.params.path ;
    /* se uso el window location ya que en los parametros no se carga completa la urls */
    console.log(window.location.pathname);
    let url_path1  = window.location.pathname.split("/es/");
    var url_path = /* url_path1[1] */ window.location.pathname;
    console.log(url_path);
    this.Service.findProject(url_path).subscribe(
      (data) => (this.responseAll = data),
      (err) => console.log(),
      () => {
        if (this.responseAll) {
          this.response = this.responseAll.jsonapi;
          console.log('entre a mostrar ',this.responseAll);
          if(this.responseAll.metatag_normalized){
            this.tags = new MetaTag(this.responseAll.metatag_normalized, this.meta);
          }
          this.entity_id = this.responseAll.entity.id;
          this.entity_type = this.responseAll.entity.type;
           // this.beforeCheck(this.response.individual);
           var url = this.response.individual + this.dataArticle;
           var data = "";
           fetch(url, {
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.response = data.data;
            // console.log(this.response);
            if (this.response) {
              var urlComments = this.urlComments + this.response.id + '&page[limit]=20';
              var dataComments = "";
              fetch(urlComments, {
              })
              .then(responseComments => responseComments.json())
              .then(data => {
                this.responseComments = data.data;
                /* Tomar las 2 iniciales del nombre que viene en el comentario */
                for (let comments of this.responseComments) {
                  let array_name = comments.name.split(' ');
                  let inicial_name1 = array_name[0].charAt(0).toUpperCase();
                  let inicial_name2 = "";
                  if(array_name[1]){
                    inicial_name2 = array_name[1].charAt(0).toUpperCase();
                  }
                  let iniciales = inicial_name1 + inicial_name2;
                  comments.initials = iniciales
                }
              })
              .catch(error => console.error(error))
             this.results = true;
             $('#exampleModalComment').removeClass('hide')
            }
          })
          .catch(error => console.error(error))
        }
      }
    );

    /* Método para obtener toda la info de los más leidos */
    this.Service.blogRelated().subscribe(
      (data) => (this.responseRelated = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente */
        }
        // if (this.response.error) {
        //   /* si hay error en la respuesta */
        // }
      }
    );
    $('html,body').scrollTop(0);
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-blog-detail').foundation();
      // $('html,body').scrollTop(0);
      this.stopSpinner();
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      comment: new FormControl(''),
    });
  }
  createFormSuscribe() {
    this.form2 =  this.formBuilder.group({
      email_suscribe: new FormControl(''),
    });
  }

  onSubmit(values) {
    /* Se recibe los valores del formulario */
    values.type_submit = 'contact_form';
    let payload = {
      "entity_id":[{"target_id":this.entity_id}],
      "entity_type":[{"value":this.entity_type}],
      "comment_type":[{"target_id":"comment"}],
      "field_name":[{"value":"comment"}],
      "subject":[{"value":values.comment.substring(0,15)}],
      "field_comment_mail":[{"value":values.email}],
      "field_comment_privacy_notice":[{"target_id":45}],
      "name":[{"value":values.name}],
      "comment_body":[
        {"value":values.comment,"format":"restricted_html"}
      ]
    };
    console.log(payload);
    this.createForm();
    this.Service.sendBlogComment( payload )
    .subscribe(
      data =>{this.responseComment = data},
      err => console.log(),
      () => {
        if(this.responseComment){
          console.log(this.responseComment);
          this.stopSpinner();
          $('#exampleModalComment').foundation('open');
          this.createForm();
        }
        // if(this.confirm.error){
        //   // $('#modalAlertError').foundation('open');
        // }
      }
    );
  }
  onSubmitSuscribe(values) {
    this.startSpinner();
    /* Se recibe los valores del formulario */
    console.log(values);
    let payload = {
      "webform_id":"newsletter",
      "correo_electronico":values.email_suscribe,
    };
    // console.log(payload);
    this.Service.suscribeNewsletter( payload )
    .subscribe(
      data =>(this.responseNewslaetter = data),
      err => console.log(),
      () => {
        // console.log(this.responseNewslaetter.sid);
        if(this.responseNewslaetter.sid){
          this.stopSpinner();
          $('#exampleModalSuscribe').foundation('open');
          this.createFormSuscribe();
        }else{
          this.stopSpinner();
          $('#exampleModalNosuscribe').foundation('open');
        }
      }
    );
  }
  // Metodo cargando
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
