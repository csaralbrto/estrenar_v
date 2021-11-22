import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { FooterService } from './footer.service';
declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public response: any;
  public total_results: any;
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor( public Service: FooterService, ) { }

  ngOnInit(): void {
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          // console.log(this.response);
          $('app-footer').foundation();
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
  	      $('app-footer').foundation();
        }
      }
    );
  }

}
