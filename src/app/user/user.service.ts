import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public blogPath: string;
  public dataUser: string;
  public updateData: string;
  public headers = new Headers();
  public options: any;
  public endpoint: string;
  public dataSubsidioPath: string;
  public dataTiempoPath: string;
  public dataContactadoPath: string;
  public dataViviendaPath: string;
  public dataPresupuestoPath: string;

  constructor( private http: Http ) { 
    this.endpoint = environment.endpointTestingApi + 'ubications/countries?_format=json';
    this.dataUser = environment.endpointTestingApiPost+ 'user/';
    this.updateData = environment.endpointTestingApiPost + 'user/logout';
    this.dataSubsidioPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Subsidio&sort=weight';
    this.dataTiempoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Tiempo en el que considera comprar&sort=weight';
    this.dataContactadoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Medio de contacto&sort=weight';
    this.dataViviendaPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Buscas vivienda para&sort=weight';
    this.dataPresupuestoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Presupuesto de compra&sort=weight';


    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', 'Bearer '+sessionStorage.getItem('access_token'));
    this.headers.append('Host', 'lab.estrenarvivienda.com'); 
    this.options = new RequestOptions({headers: this.headers});
  }

  /* Traer la info de paises */
  getCountryData(): Observable<any> {
    return this.http.get(this.endpoint)
    .pipe(map(( response => response.json() )));
  }
  /* Traer data del usuario*/
  userData( params: any ): Observable<any> {
    console.log(this.dataUser + params);
    return this.http.get(this.dataUser + params)
    .pipe(map(( response => response.json() )));
  }
  /* enviar logout */
  userLogout( params: any ): Observable<any> {
    return this.http.post(this.updateData, params)
    .pipe(map(( response => response.json() )));
  }
  /* actualizar información */
  updateDataUser( params: any ): Observable<any> {
    return this.http.patch(this.dataUser, params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info de subsidio */
  getDataSubsidio(): Observable<any> {
    return this.http.get(this.dataSubsidioPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info de tiempos */
  getDataTiempo(): Observable<any> {
    return this.http.get(this.dataTiempoPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info de medio de ser contactado */
  getDataContacado(): Observable<any> {
    return this.http.get(this.dataContactadoPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info de medio de ser contactado */
  getDataVivienda(): Observable<any> {
    return this.http.get(this.dataViviendaPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer info de presupuesto */
  getDataPresupuesto(): Observable<any> {
    return this.http.get(this.dataPresupuestoPath)
    .pipe(map(( response => response.json() )));
  }
}
