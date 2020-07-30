import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectDetailService } from './project-detail.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ProjectDetailService],
})
export class ProjectDetailComponent implements OnInit {
  public response: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: ProjectDetailService
  ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  maps_url = '';

  ngOnInit(): void {
    //Asignamos la fecha actual al campo de fecha
    $(document).foundation();
    todayDate();

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(title).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {
          /* si responde correctamente en la respuesta */
          // console.log(this.response);
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
          console.log(this.response);
        }
      }
    );
  }
}
