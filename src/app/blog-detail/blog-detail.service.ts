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

  constructor( private http: Http ) { 
    this.dataBlogPath = environment.endpointTestingApi+ 'node/article/';
    this.blogRelatedPath = environment.endpointTestingApi+ 'articles?items_per_page=4';
    this.sendComment = environment.endpointTestingApi + 'blog_comment/';
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
  sendBlogComment( operation: string, params: any ): Observable<any> {
    return this.http.post(this.sendComment + operation, params)
      .pipe(map((response => response.json())));
  }
}
