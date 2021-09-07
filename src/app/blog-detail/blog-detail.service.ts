import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailService {

  public options: any;

  public dataBlogPath: string;
  public mostReadPath: string;
  public newExperiencePath: string;
  public ecoSidePath: string;
  public recommendedPath: string;
  public blogNewsPath: string;
  public blogPath: string;
  public blogRelatedPath: string;
  public sendComment: string;
  public sendNewsletter: string;


  constructor( private http: Http ) { 
    this.dataBlogPath = environment.endpointTestingApiPost+ 'router/translate-path?path=/';
    this.blogRelatedPath = environment.endpointTestingApi+ 'articles?items_per_page=4';
    this.sendComment = environment.endpointTestingApiPost + 'comment/';
    this.sendNewsletter = environment.endpointTestingApiPost + 'webform_rest/submit?_format=json';
  }
  /* Traer la info del proyecto */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.dataBlogPath + params)
    .pipe(map(( response => response.json() )));
  }
  /* Traer articulo relacionado*/
  blogRelated(): Observable<any> {
    return this.http.get(this.blogRelatedPath)
        .pipe(map(( response => response.json() )));
  }
  /* Enviar comentario */
  // ( operation: string, params: any ): Observable<any> {
  //   return this.http.post(this.sendComment + operation, params)
  //     .pipe(map((response => response.json())));
  // }
  /* enviar info de los formularios */
  sendBlogComment( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.sendComment, params)
    .pipe(map(( response => response.json() )));
  }
  /* Newsletter */
  suscribeNewsletter( params: any ): Observable<any> {
    // console.log(this.sendComment, params);
    return this.http.post(this.sendNewsletter, params)
    .pipe(map(( response => response.json() )));
  }
}
