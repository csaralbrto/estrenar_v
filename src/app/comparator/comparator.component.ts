import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ComparatorService } from './comparator.service';
import { environment } from '../../environments/environment';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss'],
  providers: [ ComparatorService ]
})
export class ComparatorComponent implements OnInit {
  public response: any;
  public typeContact: any;
  public response_data_project: any;
  public classRow: any;
  public marginTop: any;
  public stylesText: any;
  public imgStyle: any;
  public form: FormGroup;
  public responseSubmit: any;

  constructor( public Service: ComparatorService, private router: Router,private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {
    $(window).scrollTop(0);
    this.createFormModal();
    $('#responsive-nav-social').css('display','none');
    this.startSpinner();

    /* Método para obtener toda la info del comparador */

    var comparatorsId = JSON.parse(sessionStorage.getItem("id"));
    console.log(comparatorsId);
    var stringQuery = "";
    if (comparatorsId !== null) {
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      for (let ids of storedIds) {
        stringQuery = stringQuery+ids+"+";
      }
      console.log(stringQuery);
      stringQuery = stringQuery.substring(0, stringQuery.length - 1);
      this.Service.comparatorData(stringQuery)
      .subscribe(
        data => this.response = data,
        err => console.log(),
        () => {
          if(this.response){
            // console.log(this.response);
            /* si responde correctamente */
            this.response_data_project = this.response.search_results
            var count_results = this.response_data_project.length;
            for (let project of this.response_data_project) {
              var arrayDeCadenas = project.typology_images.split(',');
              project.typology_images = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.project_category.split(',');
              project.project_category = arrayDeCadenas2;
              /* format numbr */
              project.typology_price =  new Intl.NumberFormat("es-ES").format(project.typology_price)
            }
            // console.log(count_results);
            if(count_results == 1){
              this.classRow = "medium-6";
              // this.stylesText = "margin-top: -24px;";
              // this.marginTop = "margin-top: 262px;"
              this.stylesText = "margin-top: 101px";
              this.marginTop = "margin-top: 303px;"
              this.imgStyle = "img-comparator2"
            }else if(count_results == 2){
              this.classRow = "medium-6";
              this.stylesText = "margin-top: 101px";
              this.marginTop = "margin-top: 303px;"
              this.imgStyle = "img-comparator2"
            }else if(count_results == 3){
              this.classRow = "medium-4";
              this.stylesText = "margin-top: 36px;";
              this.marginTop = "margin-top: 262px;"
              this.imgStyle = "img-comparator3"
            }else if(count_results == 4){
              this.classRow = "medium-3";
              this.marginTop = "margin-top: 241px;"
              this.imgStyle = "img-comparator4"
            }
            this.stopSpinner();
            $('app-comparator').foundation();
          }
          if(this.response.error){
            /* si hay error en la respuesta */
          }
        }
      );
    }else{
      this.router.navigate(['/']);
    }
  }
  // ngDoCheck() {
  //   $('div.container-foto').one( "click",function (e) {
  //       console.log(e.target.offsetLeft);
  //       if (e.offsetX > e.target.offsetLeft) {
  //           // click on element
  //           console.log(1);
  //       }else{
  //         // click on ::before element
  //           console.log(2);
  //     }
  //   });
  // }
  createFormModal() {
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
  removeCompare(value) {
    console.log('entre');
    // console.log("ingrese "+ Number(value));
    let valor = value.nid;
    var storedIds = JSON.parse(sessionStorage.getItem("id"));
    console.log(storedIds);
    /* remover el proyecto de los coparadores */
    const index = storedIds.indexOf(Number(valor));
    // console.log(index);
    if ( index !== -1 ) {
      storedIds.splice( index, 1 );
    }
    // console.log(storedIds);
    /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
    sessionStorage.removeItem("id");
    sessionStorage.setItem('id',JSON.stringify(storedIds));
    // this.router.navigate(['comparador']);
    var storedIds2 = JSON.parse(sessionStorage.getItem("id"));
    // console.log(storedIds2);
    if(storedIds.length > 0){
      window.location.reload();
    }else{
      sessionStorage.removeItem("id");
      this.router.navigate(['/']);
    }
  }
  onSubmitModal2(values) {
    console.log(values);
    var error = false;
    let errorspanNameModal = false;
    if(values.name == null || values.name == ""){
      $('#spanNameModal').removeClass('hide');
      errorspanNameModal = true;
    }else{
      $('#spanNameModal').addClass('hide');
      errorspanNameModal = false;
    }
    let errorspannLastNameModal = false;
    if(values.lastname == null || values.lastname == ""){
      $('#spannLastNameModal').removeClass('hide');
      errorspannLastNameModal = true;
    }else{
      $('#spannLastNameModal').addClass('hide');
      errorspannLastNameModal = false;
    }
    let errorspanPhoneModal = false;
    if(values.phone == null || values.phone == ""){
      $('#spanPhoneModal').removeClass('hide');
      errorspanPhoneModal = true;
    }else{
      $('#spanPhoneModal').addClass('hide');
      errorspanPhoneModal = false;
    }
    let errorspanEmailModal = false;
    if(values.email == null || values.email == ""){
      $('#spanEmailModal').removeClass('hide');
      errorspanEmailModal = true;
    }else{
      $('#spanEmailModal').addClass('hide');
      errorspanEmailModal = false;
    }
    let errorspanContactModal = false;
    if(values.contact == null || values.contact == "" || values.contact == "Deseas ser contactado"){
      $('#spanContactModal').removeClass('hide');
      errorspanContactModal = true;
    }else{
      $('#spanContactModal').addClass('hide');
      errorspanContactModal = false;
    }
    let errorspanTermModal = false;
    if(values.term == null || values.term == ""){
      $('#spanTermModal').removeClass('hide');
      errorspanTermModal = true;
    }else{
      $('#spanTermModal').addClass('hide');
      errorspanTermModal = false;
    }
    if(errorspanNameModal == true || errorspannLastNameModal == true || errorspanPhoneModal == true || errorspanEmailModal == true || errorspanContactModal == true || errorspanTermModal == true){
      error = true;
    }else{
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
            let type_contact = this.typeContact;
            this.actionAfterContact(type_contact);
          }
          if(!this.responseSubmit.id){
            // $('#modalAlertError').foundation('open');
          }
        }
      );
    }
  }
  startSpinner(): void {
    if (this.spinnerService) {
      this.spinnerService.show();
    }
  }
  stopSpinner(): void {
    if (this.spinnerService) {
      this.spinnerService.hide();
    }
  }
  activeAfterContact(value){
    this.typeContact = value;
  }
  actionAfterContact(type){
    if(type == 'phone'){
      let phone = '3210000000';
      let url_mailto = 'tel:' + phone
      window.open(url_mailto);
    }else if(type == 'email'){
      let email = 'email@test.com';
      let url_mailto = 'mailto:' + email
      window.open(url_mailto);
    }else{
      window.open('https://wa.me/573144119717', '_blank');
    }
  }

}
