import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailService {
  public endpoint: string;
  public endpointForm: string;

  constructor( private http: Http ) {
    this.endpoint = environment.endpointApi + 'projects/';
    this.endpointForm = environment.endpointApi + 'saveFormDate/';
   }

  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
  /* enviar info de los formularios */
  getFormService( params: any ): Observable<any> {
    console.log(this.endpointForm, params);
    return this.http.post(this.endpointForm, params)
    .pipe(map(( response => response.json() )));
  }
}
