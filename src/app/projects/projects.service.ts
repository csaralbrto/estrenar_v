import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  public servicePath: string;
  public dataPath: string;
  public endpoint: string;
  constructor( private http: Http ) { 
    this.servicePath = environment.endpointApi+ 'home/url';
    this.dataPath = environment.endpointApi+ 'projects';
    this.endpoint = environment.endpointApi + 'project/';
  }

  /* Traer toda la info de proyectos */
  getData(): Observable<any> {
    return this.http.get(this.dataPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
      .map(response => response.json());
  }
  /* Cargar informacion de salas de ventas */
  getRoomSaleData(): Observable<any> {
    return this.http.get(this.servicePath)
    .pipe(map(( response => response.json() )));
  }
}
