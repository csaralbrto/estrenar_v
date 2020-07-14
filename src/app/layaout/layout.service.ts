import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public whoWeAreData: string;
  public glossaryData: string;
  public contactUs: string;
  public privacyNotificationData: string;
  public legalNoticeData: string;
  public treatmentPolicyData: string;
  public sitemap: string;
  public webMagazine: string;

  constructor( private http: Http ) { 
    this.whoWeAreData = environment.endpointApi+ 'home/whoWeAre';
    this.glossaryData = environment.endpointApi+ 'home/glossary';
    this.contactUs = environment.endpointApi+ 'home/contactUs/';
    this.privacyNotificationData = environment.endpointApi+ 'home/privacyNotification';
    this.legalNoticeData = environment.endpointApi+ 'home/legalNotice';
    this.treatmentPolicyData = environment.endpointApi+ 'home/treatmentPolicy';
    this.sitemap = environment.endpointApi+ 'home/sitemap';
    this.webMagazine = environment.endpointApi+ 'home/webMagazine';

  }

  /* Cargar quienes somos */
  getwhoWeAreData(): Observable<any> {
    return this.http.get(this.whoWeAreData)
        .map( response => response.json() );
  }

  /* Cargar glosario */
  getGlossaryData(): Observable<any> {
    return this.http.get(this.glossaryData)
        .map( response => response.json() );
  }

  /* Enviar información contactanos */
  sendContactUs( operation: string, params: any ): Observable<any> {
    return this.http.post(this.contactUs + operation, params)
      .map(response => response.json());
    }

  /* Cargar aviso de privacidad */
  getPrivacyNotificationData(): Observable<any> {
    return this.http.get(this.privacyNotificationData)
        .map( response => response.json() );
  }

  /* Cargar aviso legal */
  getLegalNoticeData(): Observable<any> {
    return this.http.get(this.servicePath)
        .map( response => response.json() );
  }

  /* Cargar politicas de tratamientos */
  getTreatmentPolicyData(): Observable<any> {
    return this.http.get(this.servicePath)
        .map( response => response.json() );
  }

  /* Cargar mapa del sitio */
  getSitemap(): Observable<any> {
    return this.http.get(this.sitemap)
        .map( response => response.json() );
  }

  /* Cargar revista digital */
  getWebMagazine(): Observable<any> {
    return this.http.get(this.webMagazine)
        .map( response => response.json() );
  }
}
