import { Component, OnInit } from '@angular/core';
import { RevistaDigitalService } from './revista-digital.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-revista-digital',
  templateUrl: './revista-digital.component.html',
  styleUrls: ['./revista-digital.component.scss'],
  providers: [RevistaDigitalService],
})
export class RevistaDigitalComponent implements OnInit {
  tags: MetaTag;
  public response: any;
  public responseData: any;
  public dataInfo: any;
  public dataTitle: any;
  public dataInfoImg: any;
  public stringQuery = '';
  imgPath = 'https://lab.estrenarvivienda.com/';
  dataImg = '?include=field_page_paragraphs.field_ev_team_image';

  constructor( public Service: RevistaDigitalService, private meta: Meta,private spinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    this.startSpinner();
    /* Método para obtener toda la info */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          this.stringQuery = this.response.jsonapi.individual;
          this.getDataSearch();
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  getDataSearch(){
    this.Service.getInfo(this.stringQuery + this.dataImg)
      .subscribe(
        data => (this.responseData = data.data),
        err => console.log(),
        () => {
          if (this.responseData) {
            // console.log(this.responseData);
            /* Metodo para agregar los metas del sitio */
            if(this.responseData.metatag_normalized){
              this.tags = new MetaTag(this.responseData.metatag_normalized, this.meta);
            }
            this.dataInfoImg = this.responseData.field_page_paragraphs;
            var links = this.responseData.field_page_paragraphs;
            for (let link of links ) {
              this.dataTitle = link.field_digital_magazine_link.title;
              this.dataInfo = link.field_digital_magazine_link.uri;
            }
            this.stopSpinner();
          }
          /* si responde correctamente */
          if (this.responseData.error) {
            /* si hay error en la respuesta */
            this.stopSpinner();
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
