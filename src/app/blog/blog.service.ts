import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
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
    this.dataBlogPath = environment.endpointTestingApi+ 'articles';
    this.mostReadPath = environment.endpointTestingApi+ 'articles?items_per_page=2';
    this.newExperiencePath = environment.endpointTestingApi+ 'articles?items_per_page=4&page=0&article_type=La experiencia de estrenar';
    this.ecoSidePath = environment.endpointTestingApi+ 'ecoSide';
    this.recommendedPath = environment.endpointTestingApi+ 'articles?items_per_page=5';
    this.blogNewsPath = environment.endpointTestingApi+ 'articles?items_per_page=5&article_type=Noticias del sector';
    this.blogRelatedPath = environment.endpointTestingApi+ 'blogRelated';
    this.blogPath = environment.endpointTestingApi + 'blog/';
    this.sendComment = environment.endpointTestingApi + 'blog_comment/';
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


}
