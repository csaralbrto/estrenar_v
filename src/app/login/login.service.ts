import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private dataPath: string;
  private dataPathOuthToken: string;
  public headers = new Headers();
  public options: any;

  constructor(private http: Http) {
    this.dataPath = environment.endpointTestingApiPost + 'user/login?_format=json';
    this.dataPathOuthToken = environment.endpointTestingApiPost + 'oauth/token';


      this.headers.append('Content-Type', !localStorage.getItem('uid')?'application/json':'x-www-form-urlencoded');
      this.headers.append('Host', 'lab.estrenarvivienda.com'); 

    this.options = new RequestOptions({headers: this.headers});
}

  /* enviar info de los formularios */
  loginRequest( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.dataPath, params)
    .pipe(map(( response => response.json() )));
  }
  /* enviar info de los formularios */
  beforeLoginRequest( params: any ): Observable<any> {
    console.log(this.dataPathOuthToken, params);
    return this.http.post(this.dataPathOuthToken, params)
    .pipe(map(( response => response.json() )));
  }
}
