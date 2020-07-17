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

  constructor( private http: Http ) {
    this.formData = environment.endpointApi + 'saveWizardData/';
   }

  /* Enviar datos en los wizard */
  saveformData( operation: string, params: any ): Observable<any> {
    return this.http.post(this.formData + operation, params)
    .pipe(map(( response => response.json() )));
  }
}
