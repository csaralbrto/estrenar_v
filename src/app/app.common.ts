import { Injectable } from '@angular/core' ;
import { Ng2DeviceService } from 'ng2-device-detector';

@Injectable()
export class CommonFunctions{
  private deviceInfo;
  private deviceOs;
  private deviceBrowser;
  private deviceBrowseVersion;
  private deviceType;
  private deviceOsVersion;
  private deviceUserAgent;
  private deviceService = new Ng2DeviceService;
  constructor(){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile();
  }

  getDeviceInfo(){
    return this.deviceInfo;
  }
  getDeviceOs(){
    return this.deviceOs = this.deviceInfo.os;
  }
  getDeviceBrowser(){
    return this.deviceBrowser = this.deviceInfo.browser;
  }
  getDeviceVersion(){
    return this.deviceBrowseVersion = this.deviceInfo.browser_version;
  }
  getDeviceType(){
    return this.deviceType = this.deviceInfo.device;
  }
  getDeviceOsVersion(){
    return this.deviceOsVersion = this.deviceInfo.os_version;
  }
  getDeviceUserAgent(){
    return this.deviceOsVersion = this.deviceInfo.os_version;
  }
  isMobile(){
    if(this.deviceInfo.os == 'android'){
      return true;
    }
    if(this.deviceInfo.os == 'ios'){
      return true;
    }
    return false;
  }

  divideNode(Node: any, Option: any){
    let nodes, config = {
      'museums': {web: 3, mobile: 1},
      'obra_de_arte': {web: 3, mobile: 6},
      'instrumento': {web: 3, mobile: 6},
      'estampilla': {web: 3, mobile: 6},
      'pieza_coleccion_monedas_billetes': {web: 3, mobile: 6},
      'pieza_arqueologica': {web: 3, mobile: 6},
      'home_activities': {web: 4, mobile: 4},
      'home_ninos_activities': {web: 3, mobile: 3},
      'home_layout_activities': {web: 4, mobile: 4},
      'home_actividad_musical_activities': {web: 4, mobile: 4},
      'detalle_activities': {web: 4, mobile: 4},
      'slider_collections_others': {web: 4, mobile: 2},
    };
    let _divOption = (this.isMobile()) ? config[Option].mobile : config[Option].web;

    if(typeof Node.nodes !== 'undefined') {
      nodes = Node.nodes;
    }else {
      nodes = Node;
    }

    if(nodes) {
      let f_inc = _divOption, f_ini = 0, f_fin = f_inc, _v = 0, _mod = 0,_div = nodes.length, items = [], sub_items = [];
      _mod = _div % _divOption;
      if (_mod === 0) {
        _div = _div / _divOption;
      }else {
        _div = (_div + 1) / _divOption;
      }
      for (let i = 0; i < _div; i++) {
        for (let f = f_ini; f < f_fin; f++) {
          if (typeof nodes[f] !== 'undefined') {
            sub_items[_v] = nodes[f];
            _v++;
          }
        }
         _v = 0;
         f_ini = f_fin;
         f_fin = f_fin + f_inc;
         items[i] = sub_items;
         sub_items = [];
      }
      return items;
    }
  }

  divideByColumns(nodes, number){
    var va = [], key = 0;
    switch (number) {
      case 2:
        va = [[], []];
      break;
      case 3:
        va = [[], [], []];
      break;
      case 4:
        va = [[], [], [], []];
      break;
      default:
        va = [[]];
    }
    nodes.forEach(function(data) {
      va[key].push(data);
      key++;
      if(key == number){
        key = 0;
      }
    },this);
   return va;
  }
  
  paramsEndPoint(obj){      
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && obj[p] != null && obj[p] != 0) {
        str.push(p + '=' + obj[p]);
        //str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&')
  }

  getQuerySearch(base, parameters) {
    let query = base + '?', keys = Object.keys(parameters);
    keys.forEach((v) => {
      if(parameters[v]!=='' && parameters[v]!==null && parameters[v]!==0) {
        query += '&' + v + '=' + parameters[v];
      }
    });
    return query.replace(/&/, '');
  }

  orderSelectForm(select, name = 'Seleccione', value = 0, selected = true){
    let select2 = [];
    select2.push({name: name, value: value, selected: selected});
    if(typeof select.taxonomys !== 'undefined'){
      select.taxonomys.forEach( function( value, index ) {
         select2.push({name: value.name ? value.name : value.titulo, value: value.tid ? value.tid : value.nid ? value.nid : value.id, selected: false});
      }, this);
    }
    return select2;
  }
  /*defineSliderGroups = function() {
      this.columns = (this.nGroup == 3 ) ? 4:3;
      let nGroup    = this.nGroup;
      let activitys = this.activitys.nodes;
      let nIndex    = this.activitys.nodes.length / nGroup;
      let groups = [];
      for ( let i = 0; i < nIndex; i++ ) {
          groups[i] = this.defineChilds( nGroup );
      }

      this.activitys.nodes = groups;
      this.solve = true;
  }

  defineChilds = function(nGroup) {
      let childs = [];
      for ( let i = 0; i < nGroup ; i++ ) {
        childs[i] = this.activitys.nodes[i];
      }
      this.activitys.nodes.splice(0, nGroup);
      return childs;
  }*/
}
