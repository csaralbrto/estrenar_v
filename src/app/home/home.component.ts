import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ HomeService ]
})
export class HomeComponent implements OnInit {
  public response: any;

  constructor( public Service: HomeService ) { }

  ngOnInit(): void {
    $('app-home').foundation();
    
/* Método para obtener toda la info del home */
    this.Service.getAllData()
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
