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
    this.dataBlogPath = environment.endpointApi+ 'blogs';
    this.mostReadPath = environment.endpointApi+ 'mostRead';
    this.newExperiencePath = environment.endpointApi+ 'newExperience';
    this.ecoSidePath = environment.endpointApi+ 'ecoSide';
    this.recommendedPath = environment.endpointApi+ 'blogRecommended';
    this.blogNewsPath = environment.endpointApi+ 'blogNews';
    this.blogRelatedPath = environment.endpointApi+ 'blogRelated';
    this.blogPath = environment.endpointApi + 'blog/';
    this.sendComment = environment.endpointApi + 'blog_comment/';
  }
  /* Traer toda la info de blogs */
  getBlogData(): Observable<any> {
    return this.http.get(this.dataBlogPath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer los mas leidos */
  mostRead(): Observable<any> {
    return this.http.get(this.mostReadPath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer la experiencia de estrenar */
  newExperience(): Observable<any> {
    return this.http.get(this.newExperiencePath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer info nuestro lado eco*/
  ecoSide(): Observable<any> {
    return this.http.get(this.ecoSidePath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer recomendados*/
  blogRecommended(): Observable<any> {
    return this.http.get(this.recommendedPath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer noticias del sector*/
  blogNews(): Observable<any> {
    return this.http.get(this.blogNewsPath)
        .pipe(map(( response => response.json() )));
  }
  /* Traer la info del blog */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.blogPath + params)
      .pipe(map((response => response.json())));
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
