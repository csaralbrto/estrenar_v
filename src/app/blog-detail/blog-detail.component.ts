import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { BlogDetailService } from './blog-detail.service';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  providers: [BlogDetailService],
})
export class BlogDetailComponent implements OnInit {
  public response: any;
  public responseRelated: any;
  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public Service: BlogDetailService, 
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {

    const title = this.activatedRoute.snapshot.params.path;
    this.Service.findProject(title).subscribe(
      (data) => (this.response = data),
      (err) => console.log(),
      () => {
        if (this.response) {

        }
      }
    );

    /* Método para obtener toda la info de los más leidos */
    this.Service.blogRelated().subscribe(
      (data) => (this.responseRelated = data),
      (err) => console.log(),
      () => {
        if (this.response.successful) {
          /* si responde correctamente */
        }
        if (this.response.error) {
          /* si hay error en la respuesta */
        }
      }
    );
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

}
