import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss']
})
export class PostLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
  }

}
