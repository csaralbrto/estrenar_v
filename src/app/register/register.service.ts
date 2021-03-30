import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private dataPath: string;
  private dataPathOuthToken: string;
  public headers = new Headers();
  public options: any;
  public endpoint: string;

  constructor(private http: Http) {
    this.endpoint = environment.endpointTestingApi + 'ubications/countries?_format=json';
    this.dataPath = environment.endpointTestingApiPost + 'user/register?_format=json';
    this.dataPathOuthToken = environment.endpointTestingApiPost + 'oauth/token';


    this.headers.append('Content-Type', !localStorage.getItem('uid')?'application/json':'x-www-form-urlencoded');
    this.headers.append('Host', 'lab.estrenarvivienda.com'); 

  this.options = new RequestOptions({headers: this.headers});
 }
  /* Traer la info de paises */
  getCountryData(): Observable<any> {
    return this.http.get(this.endpoint)
    .pipe(map(( response => response.json() )));
  }
  /* enviar info del registro */
  RegisterRequest( params: any ): Observable<any> {
    console.log(this.dataPath, params);
    return this.http.post(this.dataPath, params)
    .pipe(map(( response => response.json() )));
  }
}
