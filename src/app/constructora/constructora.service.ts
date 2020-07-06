import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstructoraService {
  public servicePath: string;
  public dataPath: string;
  public endpoint: string;
  public projectDataConstructora: string;

  constructor( private http: Http ) { 
    this.servicePath = environment.endpointApi+ 'home/url';
    this.dataPath = environment.endpointApi+ 'constructoras';
    this.endpoint = environment.endpointApi + 'constructora/';
    this.projectDataConstructora = environment.endpointApi + 'constructora_project/';
  }

  /* Traer toda la info de constructoras */
  getData(): Observable<any> {
    return this.http.get(this.dataPath)
        .map( response => response.json() );
  }
  /* Traer la info del proyecto */
  findConstructora( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
      .map(response => response.json());
  }
  /* Traer los proyectos de la constructora */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.projectDataConstructora + params)
      .map(response => response.json());
  }
}
