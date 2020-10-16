import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ProjectDetailService } from './project-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
declare function todayDate(): any;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {
  public response: any;
  public responseAvailableAreas: any;
  public projectsAvailableAreas: any;
  public form: FormGroup;
  public form2: FormGroup;
  public results = false;
  dataProjectUrl = '?include=field_typology_project.field_project_logo,field_typology_image,field_typology_project.field_project_video,field_typology_feature.parent,field_typology_project.field_project_location,field_typology_project.field_project_builder.field_builder_logo,field_typology_project.field_project_location.field_location_opening_hours.parent,field_typology_project.field_project_feature.parent';
  url_img_path = 'https://www.estrenarvivienda.com/';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ProjectDetailService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  public galeria;
  public caracteristicas;
  public caracteristicasProject;
  public confirm: any;

  public maps_url;

  ngOnInit(): void {

    //Asignamos la fecha actual al campo de fecha
    this.createForm();
    this.createFormDates();
    todayDate();

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(title).subscribe(
      (data) => (this.response = data.jsonapi),
      (err) => console.log(),
      () => {
        if(this.response){
          // this.beforeCheck(this.response.individual);
          var url = this.response.individual + this.dataProjectUrl;
          var data = "";
          fetch(url, {
          })
          .then(response => response.json())
          .then(data => {
            // console.log(data)
            this.response = data.data;
            // console.log(this.response);
            if (this.response) {
              /* si responde correctamente en la respuesta */
              console.log(this.response);
              const latong = this.response.field_typology_project.field_project_location[0].field_location_geo_data.latlon;

              this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ latong +"&hl=es&z=14&output=embed");
              this.galeria = this.response.field_typology_image;
              this.caracteristicas = this.response.field_typology_feature;
              /* caracteristicas del inmueble */
              for (let project of this.caracteristicas) {
                var name_cara;
                if(project.parent[0].id === 'virtual'){
                  name_cara = project.name
                }else{
                  name_cara = project.parent[0].name+': '+ project.name
                }
                project.name_only = name_cara;
              }
              this.caracteristicasProject = this.response.field_typology_project.field_project_feature;
              /* caracteristicas del proyecto */
              for (let project of this.caracteristicasProject) {
                var name_cara;
                if(project.parent[0].id === 'virtual'){
                  name_cara = project.name
                }else{
                  name_cara = project.parent[0].name+': '+ project.name
                }
                project.name_only = name_cara;
              }
              this.caracteristicasProject.name_only = name_cara;

              // console.log(this.galeria);
              this.results = true;
            }
          })
          .catch(error => console.error(error))
        }
      }
    );
    /* Método para obtener areas disponibles */
    this.Service.availableAreas().subscribe(
      (data) => (this.responseAvailableAreas = data),
      (err) => console.log(),
      () => {
        if (this.responseAvailableAreas) {
          this.projectsAvailableAreas = this.responseAvailableAreas.search_results;
          for (let project of this.projectsAvailableAreas) {
            var arrayDeCadenas = project.typology_images.split(',');
            project.typology_images = arrayDeCadenas[0];
            var arrayDeCadenas2 = project.project_category.split(',');
            project.project_category = arrayDeCadenas2;
            this.results = true;
          }
          /* si responde correctamente */
        }
      }
    );
  }
  beforeCheck(url_find){
    /* Traemos la información del usuario */
    
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-detail').foundation();
    }
  }
  addCompare(value) {
    if (!sessionStorage['id']) {
      var ids = [];
      ids.push(value) 
      sessionStorage.setItem('id',JSON.stringify(ids))
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      this.router.navigate(['comparador']);
      // console.log('este es el id: ',storedIds);
    }else{
      var storedIds = JSON.parse(sessionStorage.getItem("id"));
      for (let ids of storedIds) {
        if(ids === value){
        }else{
          storedIds.push(value);
        }
      }
      /* Hay que agregar un validacion de que solo puede comparar 4 proyectos */
      sessionStorage.setItem('id',JSON.stringify(storedIds))
      this.router.navigate(['comparador']);
      // console.log('este es el id: ',storedIds);
    }
  }

  createForm() {
    this.form =  this.formBuilder.group({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      contact: new FormControl('Deseas ser contactado'),
      typeSearch: new FormControl(''),
    });
  }
  createFormDates() {
    this.form2 =  this.formBuilder.group({
      dateAgenda: new FormControl(''),
      journalOption: new FormControl(''),
      house_for: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    });
  }

  onSubmit(values) {
    /* Se recibe los valores del formulario */
    values.type_submit = 'contact_form';
    this.Service.getFormService( values )
    .subscribe(
      data =>{console.log(data)},
      err => console.log(),
      () => {
        if(this.confirm){
          // $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if(this.confirm.error){
          // $('#modalAlertError').foundation('open');
        }
      }
    );
  }

  onSubmitDates(values) {
    /* Se recibe los valores del formulario de Citas */
    values.type_submit = 'date_form';
    this.Service.getFormService( values )
    .subscribe(
      data => this.confirm = data,
      err => console.log(),
      () => {
        if(this.confirm){
          // $('#modalAlertSuccessful').foundation('open');
          console.log('Respondió '+this.confirm);
          this.form.reset();
        }
        if(this.confirm.error){
          // $('#modalAlertError').foundation('open');
        }
      }
    );
  }

}
