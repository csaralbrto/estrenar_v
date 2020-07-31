import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
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
    public Service: ProjectDetailService, 
    private sanitizer: DomSanitizer 
  ) {}
  dataPath = environment.endpoint;
  cadena = '';
  largo = '';
  
  public maps_url;

  ngOnInit(): void {

    //Asignamos la fecha actual al campo de fecha
    $(document).foundation();
    // todayDate();

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
          this.maps_url = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q="+ this.response.latitude +","+ this.response.longitude +"&hl=es&z=14&output=embed");
          console.log(this.response);
        }
      }
    );
  }
}
