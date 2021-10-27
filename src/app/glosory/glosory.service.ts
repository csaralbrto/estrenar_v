import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// import { CommonFunctions } from '../app.common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlosoryService {
  public endpoint: string;
  public sendNewsletter: string;

  constructor(private http: Http) {
    this.endpoint = environment.endpointTestingApi + 'taxonomy_term/glossary?filter[name][operator]=STARTS_WITH&filter[name][value]=';
    this.sendNewsletter = environment.endpointTestingApiPost + 'webform_rest/submit?_format=json';
   }
   /* Traer la info de glosario */
   getDataGlosary( params:any ): Observable<any>{
		return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
	}
  /* Newsletter */
  suscribeNewsletter( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.sendNewsletter, params)
    .pipe(map(( response => response.json() )));
  }
}
