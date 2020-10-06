import { Component, OnInit } from '@angular/core';
import { LegalNoticeService } from './legal-notice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss'],
  providers: [LegalNoticeService],
})
export class LegalNoticeComponent implements OnInit {
  public response: any;
  public responseData: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = '';
  imgPath = 'https://lab.estrenarvivienda.com/';
  dataImg = '?include=field_page_paragraphs.field_ev_team_image';

  constructor( public Service: LegalNoticeService, ) { }

  ngOnInit(): void {

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
            console.log(this.responseData.field_page_paragraphs);
            this.dataInfoImg = this.responseData.field_page_paragraphs;

          }
          /* si responde correctamente */
          if (this.responseData.error) {
            /* si hay error en la respuesta */
          }

        }
      );
  }

}