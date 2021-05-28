import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GlosoryService } from './glosory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../class/metatag.class';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-glosory',
  templateUrl: './glosory.component.html',
  styleUrls: ['./glosory.component.scss'],
  providers: [GlosoryService],
})
export class GlosoryComponent implements OnInit {
  tags: MetaTag;
  letter = 'a';
  public response: any;
  public responseData: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = null;
  public results = false;


  constructor( public Service: GlosoryService, private meta: Meta,private spinnerService: NgxSpinnerService ) {}

  ngOnInit(): void {
    this.startSpinner();
    /* Método para obtener toda la info */
    this.Service.getDataGlosary(this.stringQuery?this.stringQuery:this.letter)
    .subscribe(
      data => (this.response = data.data),
      err => console.log(),
      () => {
        if (this.response) {
          /* Metodo para agregar los metas del sitio */
          if(this.response.metatag_normalized){
            this.tags = new MetaTag(this.response.metatag_normalized, this.meta);
          }
          this.results = true;
          this.stopSpinner();
        }
      }
    );
  }

  change(value) {

    this.startSpinner();
    let term = "";
      Object.keys(value).forEach( function(key) {
        if(value[key] && value[key] !== 'Seleccione'){
          let p = key;
          term = value[key];
          this.stringQuery = term;
        }
      },this);
      /* llamamos la funcion que va a buscar */
      this.getDataSearch();
  }

  getDataSearch(){
    this.Service.getDataGlosary(this.stringQuery)
    .subscribe(
      data => (this.response = data.data),
      err => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          this.results = true;
          this.stopSpinner();

        }
      }
    );
  }

  ngAfterViewChecked() {
    if (this.results) {
      $('app-glosory').foundation();

    }
  }

  startSpinner(): void {
    if (this.spinnerService) {
      // console.log("ingreso spinner..");
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
