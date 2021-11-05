import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotFoundService {
  private dataPath: string;
  private adServerPath: string;
  private endpointForm: string;
  constructor(private http: Http) {
    this.dataPath = environment.endpointTestingApi + 'ev-home';
    this.adServerPath = environment.endpointTestingApiAdServer + '16&loc=https://www.estrenarvivienda.com/proyectos-vivienda';
    this.endpointForm = environment.endpointTestingApi + 'ev-lead';
  }

  /* Traer toda la info de proyectos destacados, construsctoras, blog, etc */
  getAllData(): Observable<any> {
    return this.http
      .get(this.dataPath)
      .pipe(map((response) => response.json()));
  }
  /* Traer toda la info de proyectos destacados, construsctoras, blog, etc */
  getAdServerData(): Observable<any> {
    return this.http
      .get(this.adServerPath)
      .pipe(map((response) => response.json()));
  }
  /* enviar info de los formularios */
  getFormService( params: any ): Observable<any> {
    // console.log(this.endpointForm, params);
    return this.http.post(this.endpointForm, params)
    .pipe(map(( response => response.json() )));
  }
}
