import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'estrenar-vivienda';

  ngAfterViewChecked() {
    $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      if (scroll > 0) {
        $(".header").addClass("header-fix");
      } else {
        $(".header").removeClass("header-fix");
      }
    });
  }
}
