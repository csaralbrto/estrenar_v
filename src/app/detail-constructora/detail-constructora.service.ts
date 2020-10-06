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
  public endpointProjects: string;
  public endpointForm: string;

  constructor( private http: Http ) {
    this.endpoint = environment.endpointTestingApi + 'group/builder/';
    this.endpointProjects = environment.endpointTestingApi + 'typologies/project_builder/10?items_per_page=12&page=0';
    this.endpointForm = environment.endpointApi + 'saveFormDate/';
   }

  /* Traer la info del proyecto */
  findConstructora( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer proyecto de la cosntructora */
  constructoraProjects(): Observable<any> {
    return this.http.get(this.endpointProjects)
    .pipe(map(( response => response.json() )));
  }
}
