import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ToolService } from './tool.service';
import { environment } from '../../environments/environment';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  providers: [ToolService],
})
export class ToolComponent implements OnInit, AfterViewChecked {
  public response: any;
  public responseMostRead: any;
  public form: FormGroup;
  public salario_minimo = 877803;
  public prestamo_endeudamiento: any;
  public vivienda_endeudamiento: any;
  public total_vivienda: any;
  public smmlv_vivienda: any;
  public subsidio_vivienda: any;
  public monto_prestamo_credito: any;
  public ingresos_mensuales_min_credito: any;
  public plazo_meses_credito: any;
  public tasa_de_interes_credito: any;
  public cuota_inicial_vivienda_credito: any;
  public cuota_inicial_porcentaje_vivienda_credito: any;
  public cuota_mensual_credito: any;
  constructor( public Service: ToolService, private formBuilder: FormBuilder,  ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  projects = [];
  index = 0;
  public results = false;
  url_img_path = 'https://www.estrenarvivienda.com/';

  ngOnInit(): void {

    this.createForm();
    /* Método para obtener toda la info de proyectos */
    this.Service.getData().subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          console.log(this.response);
          for (let project of this.response) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
          }
          this.results = true;
          // console.log(this.response.projects_1);
        }
        /* si responde correctamente */
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
      );
      /* Método para obtener toda la info de los más leidos */
      this.Service.getDataArticle().subscribe(
        (data) => (this.responseMostRead = data),
        (err) => console.log(),
        () => {
          if (this.responseMostRead) {
            console.log(this.responseMostRead);
            /* si responde correctamente */
          }
          if (this.responseMostRead.error) {
            /* si hay error en la respuesta */
          }
        }
      );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-tool').foundation();
    }
  }
  createForm() {
    this.form =  this.formBuilder.group({
      ingresos_mensuales_endudamiento: new FormControl(''),
      prestamo_endudamiento: new FormControl(''),
      vivienda_endudamiento: new FormControl(''),
      ingresos_mensuales_vivienda: new FormControl(''),
      ingresos_mensuales_persona_vivienda: new FormControl(''),
      ingresos_totales_vivienda: new FormControl(''),
      ahorros_cuota: new FormControl(''),
      primas_cuota: new FormControl(''),
      valor_inmueble_cuota: new FormControl(''),
      tipo_credito_cuota: new FormControl(''),
      fecha_cuota: new FormControl(''),
      valor_vivienda_credito: new FormControl(''),
      plazo_credito: new FormControl(''),
      tipo_credito_credito: new FormControl(''),
    });
  }
  change(value,type) {
    console.log(type);
    if(type == 'capacidad_endeudamiento'){
      this.prestamo_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(32);
      this.vivienda_endeudamiento = Number(value.ingresos_mensuales_endudamiento) * Number(45.714286);
      // this.form.controls.prestamo_endudamiento.setValue(0);
    }else if(type == 'subsidio_vivienda'){
      let total = 0;
      if(value.ingresos_mensuales_persona_vivienda == ""){
        total = Number(value.ingresos_mensuales_vivienda);
      }else{
        total = Number(value.ingresos_mensuales_vivienda) + Number(value.ingresos_mensuales_persona_vivienda);
      }
      this.total_vivienda = total;
      console.log(total);
      let salarios = 0;
      salarios = (Number(total) / Number(this.salario_minimo));
      console.log(salarios);
      if(salarios <= 2){
        this.subsidio_vivienda = Number(30) * Number(this.salario_minimo);
        this.smmlv_vivienda = 30;
      }else if(salarios > 2 && salarios <= 4){
        this.subsidio_vivienda = Number(30) * Number(this.salario_minimo);
        this.smmlv_vivienda = 30;
      }else if(salarios > 4){
        this.subsidio_vivienda = 0;
        this.smmlv_vivienda = 0;      
      }
    }else if(type == 'credito_vienda'){
      let cuota = 0;
      let cuota_inicial = '';
      let tasa_interes = 9;
      let interes_mensual = 0;
      let monto_prestamo = 0;
      let ingresos_mensuales_min = 0;
      let tasa_de_interes = 0;
      let cuota_inicial_vivienda = 0;
      let plazo_mes = Number(value.plazo_credito);
      let cuota_mensual = 0;
      interes_mensual = ((Number(tasa_interes) / 12) / 100);
      const base = Number(1) + Number(interes_mensual);
      const exponente = Number(value.plazo_credito);
      let r = 1;
      for(let i = 0; i<exponente; i++){
          r = r * base;
      }
      let formula_general = r;
      if(value.tipo_credito_credito == 'hipotecario'){
        cuota = Number(value.valor_vivienda_credito) * Number(0.30);
        cuota_inicial = '30%';
      }else if(value.tipo_credito_credito == 'leasing'){
        cuota = Number(value.valor_vivienda_credito) * Number(0.20);
        cuota_inicial = '20%';
      }
      monto_prestamo = (Number(value.valor_vivienda_credito) * (Number(100) - Number(cuota))) / Number(100);
      ingresos_mensuales_min = (Number(cuota) * Number(3.3));
      tasa_de_interes = tasa_interes;
      cuota_inicial_vivienda = Number(value.valor_vivienda_credito) * (Number(cuota) / Number(100));
      cuota_mensual = Number(value.valor_vivienda_credito) * ((formula_general * interes_mensual) / (formula_general - 1));
      this.monto_prestamo_credito = monto_prestamo;
      this.ingresos_mensuales_min_credito = ingresos_mensuales_min;
      this.tasa_de_interes_credito = tasa_de_interes;
      this.cuota_inicial_vivienda_credito = cuota_inicial_vivienda;
      this.cuota_inicial_porcentaje_vivienda_credito = cuota_inicial;
      this.cuota_mensual_credito = cuota_mensual;
      this.plazo_meses_credito = plazo_mes;
    }
  }
}
