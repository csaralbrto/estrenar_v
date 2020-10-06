import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ToolService {
  public loanHome: string;
  public initialQuote: string;
  public subsidyHome: string;
  public debtCapacity: string;
  public dataPathProyect: string;
  public dataPathArticles: string;

  constructor( private http: Http ) { 
    this.loanHome = environment.endpointApi + 'tools/loan_home/';
    this.initialQuote = environment.endpointApi + 'tools/initial_Quote/';
    this.subsidyHome = environment.endpointApi + 'tools/subsidy_home/';
    this.debtCapacity = environment.endpointApi + 'tools/debt_capacity/';
    this.dataPathProyect = environment.endpointTestingApi+ 'typologies?items_per_page=8&page=0';
    this.dataPathArticles = environment.endpointTestingApi+ 'articles?items_per_page=4';

  }
  /* Traer toda la info de proyectos */
  getData(): Observable<any> {
    return this.http.get(this.dataPathProyect)
    .pipe(map(( response => response.json() )));
  }

  /* Traer toda la info de articulos */
  getDataArticle(): Observable<any> {
    return this.http.get(this.dataPathArticles)
    .pipe(map(( response => response.json() )));
  }

  /* Enviar datos a cred viviendas */
  calculateLoanHome( operation: string, params: any ): Observable<any> {
    return this.http.post(this.loanHome + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Enviar datos a cuota inicial */
  calculateInitialQuote( operation: string, params: any ): Observable<any> {
    return this.http.post(this.initialQuote + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Enviar datos a subsidio vivienda */
  calculateSubsidyHome( operation: string, params: any ): Observable<any> {
    return this.http.post(this.subsidyHome + operation, params)
    .pipe(map(( response => response.json() )));
  }
  /* Enviar datos a capacidad de endeudamiento */
  calculateDebtCapacity( operation: string, params: any ): Observable<any> {
    return this.http.post(this.debtCapacity + operation, params)
    .pipe(map(( response => response.json() )));
  }
}
