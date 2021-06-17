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
  public dataPathVacacionales: string;
  public endpoint: string;
  public url_location: string;
  public url: string;
  public endpointFilter: string;
  public endpointForm: string;
  public urlMas:string;

  constructor( private http: Http, /* private commonFunctions: CommonFunctions */ ) {
    this.servicePath = environment.endpointApi+ 'project/roomSales';
    this.dataPath = environment.endpointTestingApi+ 'typologies/project_builder/10?items_per_page=8';
    this.dataPathVis = environment.endpointTestingApi+ 'typologies/project_category/7893?items_per_page=8&page=0';
    this.dataPathVacacionales = environment.endpointTestingApi+ 'typologies/project_category/7975?items_per_page=8&page=0';
    this.endpointForm = environment.endpointTestingApi + 'ev-lead';
    this.endpoint = environment.endpointApi + 'project/';
    this.endpointFilter = environment.endpointSearchApi;
    this.url_location = window.location.pathname;
    if(this.url_location == "/proyectos"){
      this.url = this.dataPath
    }else if(this.url_location == "/vis"){
      this.url = this.dataPathVis
    }else if(this.url_location == "/vacacionales"){
      this.url = this.dataPathVacacionales
    }
  }


  /* Traer toda la info de proyectos */
  getData(): Observable<any> {
    return this.http.get(this.url)
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
  /* enviar info de los formularios */
  getFormService( params: any ): Observable<any> {
    // console.log(this.endpointForm, params);
    return this.http.post(this.endpointForm, params)
    .pipe(map(( response => response.json() )));
  }
  // filtro cargar más
  getMoreData(itempaper:number): Observable<any>
  {
    this.urlMas = environment.endpointTestingApi+ `typologies/project_builder/10?items_per_page=${itempaper}`;
    return this.http.get(this.urlMas)
    .pipe(map(( response => response.json() )));
  }

}
