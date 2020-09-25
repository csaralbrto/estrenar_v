import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { BlogDetailService } from './blog-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { data } from 'jquery';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  providers: [BlogDetailService],
})
export class BlogDetailComponent implements OnInit {
  dataArticle = '?include=uid,field_article_type,field_media.field_media_image,field_tags';
  public response: any;
  public dataSubmit: any;
  public responseRelated: any;
  public form: FormGroup;
  public results = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: BlogDetailService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}

  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {
    this.createForm();

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(title).subscribe(
      (data) => (this.response = data.data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log('entre a mostrar ',this.response);
          this.results = true;
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
  }

  
  ngAfterViewChecked() {
    if (this.results) {
      $('app-blog-detail').foundation();
      $('html,body').scrollTop(0);
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
    this.dataSubmit = { 
      "entity_id":[{"target_id":8}],
      "entity_type":[{"value":"node"}],
      "comment_type":[{"target_id":"comment"}],
      "field_name":[{"value":"comment"}],
      "subject":[{"value":values.comment.substring(0,15)}],
      "field_comment_mail":[{"value":values.email}],
      "field_comment_privacy_notice":[{"target_id":336}],
      "name":[{"value":values.name}],
      "comment_body":[
        {"value":values.comment,"format":"restricted_html"}
      ]
    };
    // console.log(this.dataSubmit)
    this.Service.sendBlogComment( this.dataSubmit )
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
