import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeLayoutsService {

  public servicePath: string;
  public footerPath: string;
  public sideBarPath: string;
  public endpoint: string;
  public suscribePath: string;

  constructor( private http: Http ) {
      this.servicePath = environment.endpointApi+ 'home/url';
      this.footerPath = environment.endpointApi+ 'home/footer';
      this.sideBarPath = environment.endpointApi+ 'sideBar';
      this.endpoint = environment.endpointApi + 'findProjects/';
      this.suscribePath = environment.endpointApi + 'suscribe_Newsletter/';
  }

  /* Cargar todas las url del header */
  getHeaderData(): Observable<any> {
    return this.http.get(this.servicePath)
        .map( response => response.json() );
  }
  /* Buscador superior de proyectos */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.endpoint + params)
      .map(response => response.json());
  }
  /* Cargar todas las url del menu laterar */
  getMenuSideBar(): Observable<any> {
    return this.http.get(this.sideBarPath)
        .map( response => response.json() );
  }

  /* Cargar todas las url del footer */
  getFooterData(): Observable<any> {
    return this.http.get(this.footerPath)
        .map( response => response.json() );
  }

  /* Suscribirse al boletín */
  suscribeNewsletter( operation: string, params: any ): Observable<any> {
    return this.http.post(this.suscribePath + operation, params)
      .map(response => response.json());
  }
}
