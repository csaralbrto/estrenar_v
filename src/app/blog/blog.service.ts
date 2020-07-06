import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

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
        .map( response => response.json() );
  }
  /* Traer los mas leidos */
  mostRead(): Observable<any> {
    return this.http.get(this.mostReadPath)
        .map( response => response.json() );
  }
  /* Traer la experiencia de estrenar */
  newExperience(): Observable<any> {
    return this.http.get(this.newExperiencePath)
        .map( response => response.json() );
  }
  /* Traer info nuestro lado eco*/
  ecoSide(): Observable<any> {
    return this.http.get(this.ecoSidePath)
        .map( response => response.json() );
  }
  /* Traer recomendados*/
  blogRecommended(): Observable<any> {
    return this.http.get(this.recommendedPath)
        .map( response => response.json() );
  }
  /* Traer noticias del sector*/
  blogNews(): Observable<any> {
    return this.http.get(this.blogNewsPath)
        .map( response => response.json() );
  }
  /* Traer la info del blog */
  findProject( params: any ): Observable<any> {
    return this.http.get(this.blogPath + params)
      .map(response => response.json());
  }
  /* Traer articulo relacionado*/
  blogRelated(): Observable<any> {
    return this.http.get(this.blogRelatedPath)
        .map( response => response.json() );
  }
  /* Enviar comentario */
  sendBlogComment( operation: string, params: any ): Observable<any> {
    return this.http.post(this.sendComment + operation, params)
      .map(response => response.json());
  }


}
