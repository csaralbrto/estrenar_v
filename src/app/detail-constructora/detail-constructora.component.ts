import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { DetailConstructoraService } from './detail-constructora.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-detail-constructora',
  templateUrl: './detail-constructora.component.html',
  styleUrls: ['./detail-constructora.component.scss'],
  providers: [DetailConstructoraService],
})
export class DetailConstructoraComponent implements OnInit {
  public response: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: DetailConstructoraService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    ) {}
    dataPath = environment.endpoint;
    cadena = '';
    largo = '';

  ngOnInit(): void {
    $(document).foundation();

    // const title = this.activatedRoute.snapshot.params.path;
    // this.Service.findConstructora(title).subscribe(
    //   (data) => (this.response = data),
    //   (err) => console.log(),
    //   () => {
    //     if (this.response) {
    //       /* si responde correctamente en la respuesta */
    //       // console.log(this.response);
    //       this.largo = this.response.url_img.length;
    //       this.cadena = this.response.url_img.substr(40, this.largo);
    //       this.response.url_img = this.dataPath + this.cadena;
    //       for (let project of this.response.relacionados) {
    //         if (project.url_img) {
    //           this.largo = project.url_img.length;
    //           this.cadena = project.url_img.substr(40, this.largo);
    //           project.url_img = this.dataPath + this.cadena;
    //         }
    //       }
    //     }
    //   }
    // );
  }
}
