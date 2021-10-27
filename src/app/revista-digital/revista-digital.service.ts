import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// import { CommonFunctions } from '../app.common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevistaDigitalService {
  public endpoint: string;
  public sendNewsletter: string;

  constructor(private http: Http) {
    this.endpoint = environment.endpointApiBasicPage + '/revista-digital';
    this.sendNewsletter = environment.endpointTestingApiPost + 'webform_rest/submit?_format=json';
  }

    /* Traer la info de quienes somo */
    getData(): Observable<any> {
      return this.http.get(this.endpoint)
      .pipe(map(( response => response.json() )));
    }
    /* Traer informacion */
    getInfo( params:any ): Observable<any>{
      return this.http.get(params)
      .pipe(map(( response => response.json() )));
    }
    /* Newsletter */
    suscribeNewsletter( params: any ): Observable<any> {
      // console.log(this.sendComment, params);
      return this.http.post(this.sendNewsletter, params)
      .pipe(map(( response => response.json() )));
    }
}
