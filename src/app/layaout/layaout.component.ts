import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LayoutService } from './layout.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layaout',
  templateUrl: './layaout.component.html',
  styleUrls: ['./layaout.component.scss'],
  providers: [ LayoutService ]
})
export class LayaoutComponent implements OnInit {
  public response: any;

  constructor( public Service: LayoutService,private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {

    // this.startSpinner();
    /* Método para obtener toda la info de quienes somos */
    this.Service.getwhoWeAreData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener el glosario */
    this.Service.getGlossaryData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener aviso de privacidad */
    this.Service.getPrivacyNotificationData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener aviso legal */
    this.Service.getLegalNoticeData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener politica de tratamiento */
    this.Service.getTreatmentPolicyData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener el mapa del sitio */
    this.Service.getSitemap()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );

    /* Método para obtener la revista digital */
    this.Service.getWebMagazine()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response.successful){
          /* si responde correctamente */
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );
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

}
