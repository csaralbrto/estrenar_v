import { Injectable } from '@angular/core';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

declare var $: any;

export class MetaTag{
  public node_meta: any;
  public description = environment.description;
  public site = environment.site;
  public autor = environment.autor;
  public title = environment.title;
  public type = environment.type;
  public image = environment.image;
  public key_words = environment.key_words;
  public path = environment.path;

  constructor(private nodes, private meta:Meta) {
    this.node_meta = nodes;
    this.setTitle();
    // this.setType();
    this.setAutor();
    this.setLanguaje();
    this.setKeywords();
    this.setDescription();
    // this.setImage();
    this.setPath();
    this.setLocale();
    this.setCard();
    this.setSite();
  }

  public strip_html_tags(str) {
    if ((str===null) || (str===''))
      return false;
    else
      str = str.toString();
      str = str.replace(/(?:\r\n|\r|\n)/g, ' ');
      str = str.replace(/<[^>]*>/g, '');
      return str.substring(0, 227);
  }
  public setTitle(){
    for (let meta of this.node_meta) {
      if(meta.attributes.name === 'title'){
        this.title = meta.attributes.content;
        document.title = this.title;
        this.meta.updateTag({ property: 'og:title', content: this.title });
        this.meta.updateTag({ name: 'twitter:title', content: this.title });
      }
    }
  }
  public setAutor(){
    this.meta.updateTag({ name: 'author', content: this.autor });
  }
  public setLanguaje(){
    this.meta.updateTag({ name: 'language', content: 'spanish' });
  }
  public setKeywords(){

    for (let meta of this.node_meta) {
      if(meta.attributes.name === 'keywords'){
        this.key_words = meta.attributes.content;
        this.meta.updateTag({ name: 'keywords', content: this.key_words });
        this.meta.updateTag({ name: 'news_keywords', content: this.key_words });
      }
    }
  }
//   public setType(){
//     this.type = this.node_meta ? 'article' : this.type;
//     this.meta.updateTag({ property: 'og:type', content: this.type });
//   }
  public setDescription(){
    for (let meta of this.node_meta) {
      if(meta.attributes.name === 'description'){
        this.description = meta.attributes.content;
        this.meta.updateTag({ name: 'description', content: this.description });
        this.meta.updateTag({ property: 'og:description', content: this.description });
        this.meta.updateTag({ name: 'twitter:description', content: this.description });
      }
    }
  }
  // public setImage(){
  //   this.image = this.node_meta.imagen && this.node_meta.imagen.src !== '' ? this.node_meta.imagen.src : this.site + this.image;
  //   this.meta.updateTag({ property: 'og:image', content: this.image });
  //   this.meta.updateTag({ property: 'og:image:width', content: '600' });
  //   this.meta.updateTag({ property: 'og:image:height', content: '315' });
  //   this.meta.updateTag({ name: 'twitter:image', content: this.image });
  // }
  public setPath(){
    for (let meta of this.node_meta) {
      if(meta.tag === 'link' && meta.attributes.rel === 'canonical'){
        let url_complete = meta.attributes.href;
        this.path = url_complete.split('https://lab.estrenarvivienda.com/');
        $('link[rel="canonical"]').attr("href", window.location.hostname + '/' + this.path[1]);
        this.meta.updateTag({ property: 'og:url', content: window.location.hostname + '/' + this.path[1] });
      }
    }
    this.path = this.node_meta.path ? this.path + this.node_meta.path : this.path;
  }
  public setLocale(){
    this.meta.updateTag({ property: 'og:locale', content: 'es_la' });
  }
  public setCard(){
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
  public setSite(){
    this.meta.updateTag({ name: 'twitter:site', content: '@e_vivienda' });
  }
}
