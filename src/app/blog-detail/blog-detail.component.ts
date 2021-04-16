import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { BlogDetailService } from './blog-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { data } from 'jquery';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
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
  public dataSubmit: any;
  public entity_id: any;
  public entity_type: any;
  public responseRelated: any;
  public form: FormGroup;
  public results = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: BlogDetailService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, 
    private meta: Meta
  ) {}

  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {
    this.createForm();
    $('html,body').scrollTop(0);

    // const title = this.activatedRoute.snapshot.params.path ;
    /* se uso el window location ya que en los parametros no se carga completa la urls */
    let url_path1  = window.location.pathname.split("/es/");
    var url_path = url_path1[1]
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
              this.results = true;
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
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      comment: new FormControl(''),
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
      "field_comment_privacy_notice":[{"target_id":40}],
      "name":[{"value":values.name}],
      "comment_body":[
        {"value":values.comment,"format":"restricted_html"}
      ]
    };
    console.log(payload);
    this.createForm();
    this.Service.sendBlogComment( payload )
    .subscribe(
      data =>{console.log(data)},
      err => console.log(),
      () => {
        // if(this){
        //   // $('#modalAlertSuccessful').foundation('open');
        //   this.form.reset();
        // }
        // if(this.confirm.error){
        //   // $('#modalAlertError').foundation('open');
        // }
      }
    );
  }

}
