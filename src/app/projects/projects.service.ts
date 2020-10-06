import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// import { CommonFunctions } from '../app.common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  public servicePath: string;
  public dataPath: string;
  public dataPathVis: string;
  public endpoint: string;
  public url_location: string;
  public endpointFilter: string;
  
  constructor( private http: Http, /* private commonFunctions: CommonFunctions */ ) { 
    this.servicePath = environment.endpointApi+ 'project/roomSales';
    this.dataPath = environment.endpointTestingApi+ 'typologies/project_builder/10?items_per_page=8';
    this.dataPathVis = environment.endpointTestingApi+ 'typologies/project_category/7601?items_per_page=8&page=0';
    this.endpoint = environment.endpointApi + 'project/';
    this.endpointFilter = environment.endpointSearchApi;
    this.url_location = window.location.pathname;
  }
  

  /* Traer toda la info de proyectos */
  getData(): Observable<any> {
    return this.http.get(this.url_location == "/proyectos"? this.dataPath: this.dataPathVis)
    .pipe(map(( response => response.json() )));
  }
  /* Traer proyectos filtrados */
	getDataFilter( params:any ): Observable<any>{
		return this.http.get(this.endpointFilter + params)
    .pipe(map(( response => response.json() )));
	}
  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
    .pipe(map(( response => response.json() )));
  }
  /* Cargar informacion de salas de ventas */
  getRoomSaleData(): Observable<any> {
    return this.http.get(this.servicePath)
    .pipe(map(( response => response.json() )));
  }
}
