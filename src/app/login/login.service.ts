import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private dataPath: string;
  constructor(private http: Http) {
    this.dataPath = environment.endpointTestingApiPost + 'user/login?_format=json';
}

  /* enviar info de los formularios */
  loginRequest( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.dataPath, params)
    .pipe(map(( response => response.json() )));
  }
}
