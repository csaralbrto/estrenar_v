import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
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
    this.dataPath = environment.endpointTestingApi+ 'builders?search=ama&builder_location_id=9824&items_per_page=4&page=0';
    this.endpoint = environment.endpointApi + 'constructora/';
    this.projectDataConstructora = environment.endpointApi + 'constructora_project/';
  }

  /* Traer toda la info de constructoras */
  getData(): Observable<any> {
    return this.http.get(this.dataPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer la info del proyecto */
  findConstructora( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer los proyectos de la constructora */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.projectDataConstructora + params)
    .pipe(map(( response => response.json() )));
  }
}
