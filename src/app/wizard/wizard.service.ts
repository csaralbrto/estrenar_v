import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  public formData: string;
  public dataSearchPath: string;
  public dataPresupuestoPath: string;
  public dataSubsidioPath: string;
  public dataTiempoPath: string;
  public dataContactadoPath: string;
  public dataViviendaPath: string;

  constructor( private http: Http ) {
    this.formData = environment.endpointApi + 'saveWizardData/';
    this.dataSearchPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences_location';
    this.dataPresupuestoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Presupuesto de compra&sort=weight';
    this.dataSubsidioPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Subsidio&sort=weight';
    this.dataTiempoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Tiempo en el que considera comprar&sort=weight';
    this.dataContactadoPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Medio de contacto&sort=weight';
    this.dataViviendaPath = environment.endpointTestingApi+ 'taxonomy_term/user_preferences?filter[parent.name]=Buscas vivienda para&sort=weight';
   }

  /* Enviar datos en los wizard */
  saveformData( operation: string, params: any ): Observable<any> {
    return this.http.post(this.formData + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer toda la info de locaciones */
  getDataSearch(): Observable<any> {
    return this.http.get(this.dataSearchPath)
    .pipe(map(( response => response.json() )));
  }
  /* Traer toda la info de presupuestos */
  getDataPresupuesto(): Observable<any> {
    return this.http.get(this.dataPresupuestoPath)
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
}
