import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ComparatorService } from './comparator.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss'],
  providers: [ ComparatorService ]
})
export class ComparatorComponent implements OnInit {
  public response: any;

  constructor( public Service: ComparatorService ) { }
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';

  ngOnInit(): void {

    /* Método para obtener toda la info del comparador */
    this.Service.comparatorData()
    .subscribe(
      data => this.response = data,
      err => console.log(),
      () => {
        if(this.response){
          console.log(this.response);
          /* si responde correctamente */
          for (let project of this.response) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(33, this.largo);
              project.url_img = this.dataPath + this.cadena;
            }
          }
        }
        if(this.response.error){
          /* si hay error en la respuesta */
        }
      }
    );    
  }

}
