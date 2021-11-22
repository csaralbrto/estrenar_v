import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  public dataPath: string;

  constructor( private http: Http ) {
    this.dataPath = environment.endpointTestingApi+ 'ev-footer';
  }

  /* Traer toda la info de footer */
  getData(): Observable<any> {
    return this.http.get(this.dataPath)
    .pipe(map(( response => response.json() )));
  }
}
