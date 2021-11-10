import { Component, OnInit } from '@angular/core';
import { ConstructoraService } from './constructora.service';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-constructora',
  templateUrl: './constructora.component.html',
  styleUrls: ['./constructora.component.scss'],
  providers: [ConstructoraService],
})
export class ConstructoraComponent implements OnInit {
  public response: any;
  public total_results: any;
  public constructoras: any;
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor( public Service: ConstructoraService, private spinnerService: NgxSpinnerService ) { }
  dataPath = environment.endpoint;
  cadena = '';
  public url_search_word = 'https://lab.estrenarvivienda.com/api/builders/all?search=';
  largo = '';
  optionsLocationSelected: string = '';
  public stringQuery: any;
  public filterLocation: any;

  ngOnInit(): void {
    this.startSpinner();
    $(window).scrollTop(0);
    $('#responsive-nav-social').css('display','none');
    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          if(!(this.response.search_results.length < this.total_results)){
            $('#buttonLoadMore').addClass('disabled');
          }
          this.total_results = this.response.total;
          this.constructoras = this.response.search_results;
          for (let project of this.constructoras) {
            var arrayDeCadenas = project.builder_location_phone.split(',');
            project.builder_location_phone = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.builder_address.split(',');
            project.builder_address = arrayDeCadenas2[0];
          }
          if(this.response.facets.builder_location_city){
            this.filterLocation = this.response.facets.builder_location_city;
          }
          this.stopSpinner();
          $('app-constructora').foundation();
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
          this.stopSpinner();
          $('app-constructora').foundation();
        }
      }
    );
  }
  onFocusSearch(){
    $('.img-search').addClass('hide');
  }
  onFocusOutSearch(){
    $('.img-search').removeClass('hide');
  }
  loadMore(value){
    this.startSpinner();
    let val = this.response.search_results.length;
    if(val < this.total_results){
      let numb_search = Number(val) + Number(4);
      this.Service.loadMore(numb_search).subscribe(
        (data) => (this.response = data),
        (err) => console.log(),
        () => {
          if (this.response) {
            console.log(this.response);
            console.log(this.response.search_results.length);
            this.constructoras = this.response.search_results;
            for (let project of this.constructoras) {
              var arrayDeCadenas = project.builder_location_phone.split(',');
              project.builder_location_phone = arrayDeCadenas[0];
              var arrayDeCadenas2 = project.builder_address.split(',');
              project.builder_address = arrayDeCadenas2[0];
            }
            if(this.response.facets.builder_location_city){
              this.filterLocation = this.response.facets.builder_location_city;
            }
            this.stopSpinner();
            if(this.response.search_results.length == 32){
              if(value == 'desktop'){
                $('#buttonLoadMoreDesktop').addClass('disabled');
              }else{
                $('#buttonLoadMoreMobile').addClass('disabled');
              }
            }
          }
          /* si responde correctamente */
          if (this.response.error) {
            /* si hay error en la respuesta */
            this.stopSpinner();
          }
        }
      );
    }else{
      $('#buttonLoadMore').addClass('disabled');
    }
  }
  change(value) {
    this.startSpinner();
    if(value == 1){
      this.stringQuery = $("#locationMobile").val();
    }else{
      this.stringQuery = $("#locationDesktop").val();
    }
    var url = this.stringQuery;
    var data = "";
    fetch(url, {
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
      // console.log(this.response);
      if (this.response) {
        // console.log(this.response.search_results);
        this.constructoras = this.response.search_results;
        for (let project of this.constructoras) {
          var arrayDeCadenas = project.builder_location_phone.split(',');
          project.builder_location_phone = arrayDeCadenas[0];
          var arrayDeCadenas2 = project.builder_address.split(',');
          project.builder_address = arrayDeCadenas2[0];
        }
        if(this.response.facets.builder_location_city){
          // console.log(this.response.facets.builder_location_city);
            this.optionsLocationSelected = '';
            for(let optionType of this.response.facets.builder_location_city){
              if(optionType.values.active == 'true'){
                this.optionsLocationSelected = optionType.url;
              }
            }
            this.filterLocation = this.response.facets.builder_location_city;
          }

        // this.results = true;
        this.stopSpinner();
      }

    })
    .catch(error => console.error(error))



  }
  filterByWord(type) {
    this.startSpinner();
    var search_string: any;
    if(type == 'mobile'){
      search_string = $('#searchWordMobile').val();
    }else{
      search_string = $('#searchWordDesktop').val();
    }
    var url = this.url_search_word + search_string;
    console.log(url);
    var data = "";
    fetch(url, {
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      this.response = data;
      // console.log(this.response);
      if (this.response) {
        console.log(this.response);
        this.constructoras = this.response;
        // for (let project of this.constructoras) {
          // if(this.constructoras.builder_location_phone !== 'undefined'){
          //   var arrayDeCadenas = this.constructoras.builder_location_phone.split(',');
          //   this.constructoras.builder_location_phone = arrayDeCadenas[0];
          // }
          if(this.constructoras.builder_address){
            var arrayDeCadenas2 = this.constructoras.builder_address.split(',');
            this.constructoras.builder_address = arrayDeCadenas2[0];
          }
        // }
        // if(this.response.facets.builder_location_city !== 'undefined'){
        //   this.filterLocation = this.response.facets.builder_location_city;
        // }
        this.stopSpinner();
      }
    })
    .catch(error => console.error(error))
  }  // metodos cargando
  startSpinner(): void {
    if (this.spinnerService) {
      this.spinnerService.show();
    }
  }
  stopSpinner(): void {

    if (this.spinnerService) {
      // console.log("ingrese a parar");
      this.spinnerService.hide();
    }
  }
}
