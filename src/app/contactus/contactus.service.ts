import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {
  public endpoint: string;
  public endpointForm: string;
  public sendNewsletter: string;

  constructor( private http: Http ) {
    this.endpointForm = environment.endpointTestingApi + 'ev-lead';
    this.sendNewsletter = environment.endpointTestingApiPost + 'webform_rest/submit?_format=json';
  }
  /* enviar info de los formularios */
  getFormService( params: any ): Observable<any> {
    // console.log(this.endpointForm, params);
    return this.http.post(this.endpointForm, params)
    .pipe(map(( response => response.json() )));
  }
  /* Newsletter */
  suscribeNewsletter( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.sendNewsletter, params)
    .pipe(map(( response => response.json() )));
  }
}
