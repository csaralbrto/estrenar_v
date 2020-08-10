import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailConstructoraService {
  public endpoint: string;
  public endpointForm: string;

  constructor( private http: Http ) {
    this.endpoint = environment.endpointApi + 'constructoras/';
    this.endpointForm = environment.endpointApi + 'saveFormDate/';
   }

  /* Traer la info del proyecto */
  findConstructora( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
}
