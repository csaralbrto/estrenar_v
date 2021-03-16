import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentUploadService {
  public formData: string;
  public dataSearchPath: string;
  public dataPath: string;

  constructor( private http: Http ) {
    this.formData = environment.endpointApi + 'saveData/';
    this.dataSearchPath = environment.endpointTestingApi+ 'ev-project/form';
    this.dataPath = environment.endpointTestingApi+ 'typologies/project_builder/10?items_per_page=8';
   }

  /* Enviar datos para crear proyectos */
  saveformData( operation: string, params: any ): Observable<any> {
    return this.http.post(this.formData + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer toda la info */
  getDataSearch(): Observable<any> {
    return this.http.get(this.dataSearchPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info para select ciudades */
  getDataFilterCity(): Observable<any> {
    return this.http.get(this.dataPath)
    .pipe(map(( response => response.json() )));
  }
}
