import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ToolService {
  public loanHome: string;
  public initialQuote: string;
  public subsidyHome: string;
  public debtCapacity: string;

  constructor( private http: Http ) { 
    this.loanHome = environment.endpointApi + 'tools/loan_home/';
    this.initialQuote = environment.endpointApi + 'tools/initial_Quote/';
    this.subsidyHome = environment.endpointApi + 'tools/subsidy_home/';
    this.debtCapacity = environment.endpointApi + 'tools/debt_capacity/';

  }

  /* Enviar datos a cred viviendas */
  calculateLoanHome( operation: string, params: any ): Observable<any> {
    return this.http.post(this.loanHome + operation, params)
      .map(response => response.json());
  }
  /* Enviar datos a cuota inicial */
  calculateInitialQuote( operation: string, params: any ): Observable<any> {
    return this.http.post(this.initialQuote + operation, params)
      .map(response => response.json());
  }
  /* Enviar datos a subsidio vivienda */
  calculateSubsidyHome( operation: string, params: any ): Observable<any> {
    return this.http.post(this.subsidyHome + operation, params)
      .map(response => response.json());
  }
  /* Enviar datos a capacidad de endeudamiento */
  calculateDebtCapacity( operation: string, params: any ): Observable<any> {
    return this.http.post(this.debtCapacity + operation, params)
      .map(response => response.json());
  }
}
