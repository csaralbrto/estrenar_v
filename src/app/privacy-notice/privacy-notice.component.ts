import { Component, OnInit } from '@angular/core';
import { PrivacyNoticeService } from './privacy-notice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
  providers: [PrivacyNoticeService],
})
export class PrivacyNoticeComponent implements OnInit {
  public response: any;
  public responseData: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = '';
  imgPath = 'https://lab.estrenarvivienda.com/';
  dataImg = '?include=field_page_paragraphs.field_ev_team_image';

  constructor( public Service: PrivacyNoticeService, ) { }

  ngOnInit(): void {

    /* Método para obtener toda la info de proyectos */
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
          }
          /* si responde correctamente */
          if (this.responseData.error) {
            /* si hay error en la respuesta */
          }

        }
      );
  }

}
