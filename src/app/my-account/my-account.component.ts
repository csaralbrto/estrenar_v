import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
  }

}
