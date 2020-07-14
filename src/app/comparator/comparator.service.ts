import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComparatorService {
  public comparatorData: string;

  constructor( private http: Http ) {
    this.comparatorData = environment.endpointApi+ 'comparator/';
   }
  
  /* Traer info al comparador*/
  comparatoData(): Observable<any> {
    return this.http.get(this.comparatorData)
        .map( response => response.json() );
  }
}
