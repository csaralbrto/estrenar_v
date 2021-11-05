import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotFoundService } from './not-found.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  providers: [NotFoundService],
})
export class NotFoundComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public responseAdServer: any;
  public responseSubmit: any;
  public projects1: any;
  public projects2: any;
  public projects3: any;
  public results = false;
  public filterPrice: any;
  public form: FormGroup;
  public stringText: any;

  constructor(public Service: NotFoundService, private formBuilder: FormBuilder, private meta: Meta, private router: Router, private spinnerService: NgxSpinnerService) {}
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
    this.startSpinner();
    this.createForm();
    // $('#welcomeModal').foundation('open');
    this.stringText = '...';
    /* Método para obtener toda la info del home */
    this.Service.getAllData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          /* se envian los metas al servicio creado */
          if(this.response.metatag_normalized){
            this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
          }
          for (let project of this.response.home_featured_typologies) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
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
          // console.log(this.projects2);
          this.results = true;
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
    // this.Service.getAdServerData().subscribe(
    //   (data) => (this.responseAdServer = data),
    //   (err) => console.log(),
    //   () => {
    //     if (this.responseAdServer){
    //       console.log(this.responseAdServer)
    //     }
    //   }
    // );
  }

  ngAfterContentChecked() {
    if (this.results) {
      $('not-found').foundation();

      if ($('.slider-home').length) {
        $('.slider-home').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-projects-home').length) {
        $('.slider-projects-home').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
          // mobileFirst: true,
          // swipe: true,
          // swipeToSlide: true,
          // touchMove: true,
        });
      }
      if ($('.slider-builders-home').length) {
        $('.slider-builders-home').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      if ($('.slider-blog-home').length) {
        $('.slider-blog-home').not('.slick-initialized').slick({
          dots: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
      }
      this.stopSpinner();
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      contact: new FormControl('Deseas ser contactado'),
      typeSearch: new FormControl(''),
      term: new FormControl(''),
    });
  }
  onSubmit(values) {
    console.log(values);
    var error = false;
    if(values.name == null || values.name == ""){
      $('#spanName').removeClass('hide');
      error = true;
    }else{
      $('#spanName').addClass('hide');
      error = false;
    }
    if(values.lastname == null || values.lastname == ""){
      $('#spannLastName').removeClass('hide');
      error = true;
    }else{
      $('#spannLastName').addClass('hide');
      error = false;
    }
    if(values.phone == null || values.phone == ""){
      $('#spanPhone').removeClass('hide');
      error = true;
    }else{
      $('#spanPhone').addClass('hide');
      error = false;
    }
    if(values.email == null || values.email == ""){
      $('#spanEmail').removeClass('hide');
      error = true;
    }else{
      $('#spanEmail').addClass('hide');
      error = false;
    }
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContact').removeClass('hide');
      error = true;
    }else{
      $('#spanContact').addClass('hide');
      error = false;
    }
    if(values.term == null || values.term == ""){
      $('#spanTerm').removeClass('hide');
      error = true;
    }else{
      $('#spanTerm').addClass('hide');
      error = false;
    }
    if(!error){
      /* Se recibe los valores del formulario */
      var f = new Date();
      var date = f.getFullYear()+ "-" + (f.getMonth() +1) + "-" + f.getDate() + "T" + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
      values.type_submit = 'contact_form';
      var url = window.location.pathname;
      let payload = {
          "identity": {
            "mail": values.email,
            "phone": values.phone
        },
        "personal": {
            "name": values.name,
            "lastName": values.lastname
        },
        "campaign": {
            "options": [
                {
                    "UTM source": sessionStorage['UTMSource']?sessionStorage.getItem("UTMSource"):""
                },
                {
                    "UTM medium": sessionStorage['UTMMedium']?sessionStorage.getItem("UTMMedium"):""
                },
                {
                    "UTM content": sessionStorage['UTMContent']?sessionStorage.getItem("UTMContent"):""
                },
                {
                    "UTM campaign": sessionStorage['UTMCampaing']?sessionStorage.getItem("UTMCampaing"):""
                }
            ]
        },
        "additional": {
            "comment": values.comment,
            "emailCopy": values.emailCopy
        },
        "contextual": {
            "options": [
                {
                    "Ruta": url
                },
                {
                    "Dispositivo": "Escritorio"
                }
            ]
        },
        "profiling": {
            "survey":
            [
                {
                    "Deseas ser contactado vía": values.contact
                }
            ],
            "location": values.city
        },
        "main": {
            "privacyNotice": 5323,
            "category": "Contáctenos"
        }
    }
    // console.log(payload);
      this.Service.getFormService( payload )
      .subscribe(
        data =>(this.responseSubmit = data),
        err => console.log(),
        () => {
          if(this.responseSubmit.id){
            $('#exampleModal1').foundation('open');
            this.form.reset();
          }
          if(!this.responseSubmit.id){
            // $('#modalAlertError').foundation('open');
          }
        }
      );
    }
  }
  findTypes(value){
    var searchWord = value;
    sessionStorage.removeItem('word_search');
    sessionStorage.removeItem('projectTitle');
    sessionStorage.setItem('word_search',searchWord);
    sessionStorage.setItem('projectTitle',searchWord);
    this.router.navigate(['/proyectos']);
  }
  goFavorites(){
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    if(!sessionStorage['favorite']){
      // this.router.navigate(['login']);
    }else{
      this.router.navigate(['favoritos']);
    }
  }
  addFavorite(value) {
    const user_login = sessionStorage.getItem('access_token');
    const user_uid = sessionStorage.getItem('uid');
    if(user_login === null || user_uid === null){
      this.router.navigate(['login']);
    }else{
      if (!sessionStorage['favorite']) {
        var ids = [];
        ids.push(value)
        sessionStorage.setItem('favorite',JSON.stringify(ids))
        var storedIds = JSON.parse(sessionStorage.getItem("id"));
        // this.router.navigate(['comparador']);
        // console.log('este es el id: ',storedIds);
      }else{
        var storedIds = JSON.parse(sessionStorage.getItem("favorite"));
        if(storedIds.indexOf( value ) !== 1){
          storedIds.push(value);
        }
        /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
        sessionStorage.setItem('favorite',JSON.stringify(storedIds))
        // this.router.navigate(['comparador']);
        // console.log('este es el id: ',storedIds);
      }
    }
  }
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
  loadCollection(value,name){
    console.log('collection');
    sessionStorage.removeItem('wordTitleCollection');
    sessionStorage.removeItem('collection_id');
    sessionStorage.setItem('wordTitleCollection',name)
    sessionStorage.setItem('collection_id',value);
    this.router.navigate(['/proyectos']);
  }
}
