import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ComparatorService } from './comparator.service';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss'],
  providers: [ ComparatorService ]
})
export class ComparatorComponent implements OnInit {
  public response: any;

  constructor( public Service: ComparatorService ) { }

  ngOnInit(): void {

    /* Método para obtener toda la info del comparador */
    this.Service.comparatorData()
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

}
