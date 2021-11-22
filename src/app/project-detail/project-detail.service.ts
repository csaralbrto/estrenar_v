import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailService {
  public endpoint: string;
  public endpointForm: string;
  public endpointProjects: string;
  public placesEndpoint: string;
  public headers: any;

  constructor( private http: Http ) {
    this.endpoint = environment.endpointTestingApiPost + 'router/translate-path?path=/node/';
    this.endpointProjects = environment.endpointTestingApi + 'typologies/project/9703?items_per_page=8';
    this.endpointForm = environment.endpointTestingApi + 'ev-lead';
    this.headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   }

  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    console.log('consulta del proyecto',this.endpoint, params);
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
  /* enviar info de los formularios */
  getFormService( params: any ): Observable<any> {
    // console.log(this.endpointForm, params);
    return this.http.post(this.endpointForm, params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer areas disponibles */
  availableAreas(): Observable<any> {
    return this.http.get(this.endpointProjects)
    .pipe(map(( response => response.json() )));
  }
  /* Traer places google */
  placesNearBay( params: any ): Observable<any> {
    return this.http.get(params)
    .pipe(map(( response => response.json() )));
  }
}
