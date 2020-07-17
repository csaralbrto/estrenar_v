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
    this.compararData = environment.endpointApi+ 'comparator/';
   }
  
  /* Traer info al comparador*/
  comparatorData(): Observable<any> {
    return this.http.get(this.compararData)
    .pipe(map(( response => response.json() )));
  }
}
