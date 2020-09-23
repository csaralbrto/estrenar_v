import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// import { CommonFunctions } from '../app.common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegalNoticeService {
  public endpoint: string;

  constructor(private http: Http) {
    this.endpoint = environment.endpointApiBasicPage + '/aviso-legal';
   }

  /* Traer la info de aviso legal */
  getData(): Observable<any> {
    return this.http.get(this.endpoint)
    .pipe(map(( response => response.json() )));
  }
  /* Traer informacion */
	getInfo( params:any ): Observable<any>{
		return this.http.get(params)
    .pipe(map(( response => response.json() )));
	}
}
