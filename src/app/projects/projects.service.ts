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
    this.dataPath = environment.endpointTestingApi+ 'typologies?items_per_page=';
    this.dataPathVis = environment.endpointTestingApi+ 'typologies/project_category/7893?items_per_page=';
    this.dataPathVacacionales = environment.endpointTestingApi+ 'typologies/project_category/7975?items_per_page=';
    this.endpointForm = environment.endpointTestingApi + 'ev-lead';
    this.endpoint = environment.endpointApi + 'project/';
    this.endpointFilter = environment.endpointSearchApi;
    this.url_location = window.location.pathname;
    if(this.url_location == "/proyectos-vivienda"){
      this.url = this.dataPath
    }else if(this.url_location == "/vivienda-interes-social"){
      this.url = this.dataPathVis
    }else if(this.url_location == "/proyectos-vacacionales"){
      this.url = this.dataPathVacacionales
    }
  }


  /* Traer toda la info de proyectos */
  // getData(): Observable<any> {
  //   return this.http.get(this.url)
  //   .pipe(map(( response => response.json() )));
  // }

    /* Traer toda la info de proyectos  v2*/
  getData(projectcont :number): Observable<any> {
    // this.urlMas = environment.endpointTestingApi +`typologies?items_per_page=${projectcont}`
    this.urlMas = this.url +`${projectcont}`
    console.log(this.urlMas);
    return this.http.get(this.urlMas)
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
  /* filtro cargar más */
  getMoreData(url:any): Observable<any>{
    this.urlMas = url
    //  environment.endpointTestingApi+ `typologies/project_builder/10?items_per_page=${itempaper}`;
    return this.http.get(this.urlMas)
    .pipe(map(( response => response.json() )));
  }

}
