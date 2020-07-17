import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private dataPath: string;
  constructor( private http: Http ) { 
    this.dataPath = environment.endpointApi+ 'home/allData';
  }

  /* Traer toda la info de proyectos destacados, construsctoras, blog, etc */
  getAllData(): Observable<any> {
    return this.http.get(this.dataPath)
    .pipe(map(( response => response.json() )));
  }
}
