import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  public formData: string;
  public dataSearchPath: string;

  constructor( private http: Http ) {
    this.formData = environment.endpointApi + 'saveWizardData/';
    this.dataSearchPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences_location';
   }

  /* Enviar datos en los wizard */
  saveformData( operation: string, params: any ): Observable<any> {
    return this.http.post(this.formData + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer toda la info de proyectos */
  getDataSearch(): Observable<any> {
    return this.http.get(this.dataSearchPath)
    .pipe(map(( response => response.json() )));
  }
}
