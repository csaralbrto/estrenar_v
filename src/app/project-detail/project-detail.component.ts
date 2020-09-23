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
  public form: FormGroup;
  public form2: FormGroup;
  public results = false;

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
  public confirm: any;
  
  public maps_url;

  ngOnInit(): void {

    //Asignamos la fecha actual al campo de fecha
    this.createForm();
    this.createFormDates();
    todayDate();

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(title).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente en la respuesta */
          console.log(this.response);
          this.largo = this.response.url_img.length;
          this.cadena = this.response.url_img.substr(40, this.largo);
          this.response.url_img = this.dataPath + this.cadena;
          for (let project of this.response.relacionados) {
            if (project.url_img) {
              this.largo = project.url_img.length;
              this.cadena = project.url_img.substr(40, this.largo);
              project.url_img = this.dataPath + this.cadena;
            }
          }
          for (let project2 of this.response.otras_propiedades) {
            if (project2.url_img) {
              this.largo = project2.url_img.length;
              this.cadena = project2.url_img.substr(40, this.largo);
              project2.url_img = this.dataPath + this.cadena;
            }
          }
          this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ this.response.latitude +","+ this.response.longitude +"&hl=es&z=14&output=embed");
          // console.log(this.response);
          this.galeria = JSON.parse(this.response.galeria);
          this.results = true;
        }
      }
    );
  }
  ngAfterViewChecked() {
    if (this.results) {
      $('app-project-detail').foundation();
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
