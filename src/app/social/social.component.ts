import { Component, OnInit, Input } from '@angular/core';
import { SocialService } from './social.services';
import { Meta } from '@angular/platform-browser';
import { MetaTag } from '../../class/metatag.class';

@Component({
    moduleId: module.id,
    selector: 'as-social',
    templateUrl: 'social.html'
})

export class SocialComponent implements OnInit, Input{
    @Input() nodes_tags: any;
    tag: MetaTag;
    site: any;
    title: any;
    type: any;
    image: any;
    path: any;
    gp: any;
    fb: any;
    tw: any;
    href: any;
    href_fb: any;

    constructor( private meta: Meta ) { }

    ngOnInit(){
        let tags = [];
        this.tag = new MetaTag(this.nodes_tags, this.meta);

        /* url sitio */
        this.site = '';
        /* titulo del sitio */
        this.title = this.nodes_tags.title ? this.nodes_tags.title : '';
        /* tags o website */
        this.type = this.nodes_tags ? 'article' : 'website';
        /* imagen del sitio */
        this.image = this.nodes_tags.imagen ? this.nodes_tags.imagen.src : this.site + '';
        /* path del sitio */
        this.path = this.nodes_tags.path ? this.nodes_tags.path : this.site;

        this.href_fb = this.site + this.path;
        this.href = encodeURIComponent(this.href_fb);

        this.fb = 'https://www.facebook.com/sharer/sharer.php?u=' + this.href + '&amp;src=sdkpreparse'
        this.tw = 'https://twitter.com/intent/tweet?text=' + this.title + '&url=' + this.href;
        this.gp = 'https://plus.google.com/share?url=' + this.href;
    }
}
