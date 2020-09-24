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

  constructor( private http: Http ) { 
    this.dataUser = environment.endpointTestingApiPost+ 'user/';
    this.updateData = environment.endpointTestingApiPost + 'user/logout';


    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Host', 'lab.estrenarvivienda.com'); 
    this.options = new RequestOptions({headers: this.headers});
  }

  /* Traer data del usuario*/
  userData( params: any ): Observable<any> {
    // console.log(this.dataUser + params);
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
}
