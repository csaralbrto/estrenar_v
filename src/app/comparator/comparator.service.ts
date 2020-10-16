import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComparatorService {
  public compararData: string;

  constructor( private http: Http ) {
    this.compararData = environment.endpointTestingApi+ 'typologies?items_per_page=12&page=0&id=';
   }
  
  /* Traer info al comparador*/
  comparatorData( params: any ): Observable<any> {
    console.log(this.compararData + params);
    return this.http.get(this.compararData + params)
    .pipe(map(( response => response.json() )));
  }
}
