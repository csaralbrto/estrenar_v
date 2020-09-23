import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GlosoryService } from './glosory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-glosory',
  templateUrl: './glosory.component.html',
  styleUrls: ['./glosory.component.scss'],
  providers: [GlosoryService],
})
export class GlosoryComponent implements OnInit {
  letter = 'a';
  public response: any;
  public responseData: any;
  public dataInfo: any;
  public dataInfoImg: any;
  public stringQuery = null;
  public results = false;


  constructor( public Service: GlosoryService, ) {}

  ngOnInit(): void {

    /* Método para obtener toda la info */
    this.Service.getDataGlosary(this.stringQuery?this.stringQuery:this.letter)
    .subscribe(
      data => (this.response = data.data),
      err => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          this.results = true;
        }
      }
    );
  }

  change(value) {
    // this.data.nodes = [];
    let term = "";
    // this.query_elasticsearch[this.collectionActive].page = 0;

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
        }
      }
    );
  }

  ngAfterViewChecked() {
    if (this.results) {
      $('app-glosory').foundation();
    }
  }
}
