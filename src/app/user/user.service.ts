import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  constructor( private http: Http ) { 
    this.dataUser = environment.endpointTestingApiPost+ 'user/';
    this.updateData = environment.endpointTestingApiPost + 'user/logout';
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
