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

  constructor( private http: Http ) {
    this.endpoint = environment.endpointApi + 'projects/';
   }

  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    console.log(params);
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
}
