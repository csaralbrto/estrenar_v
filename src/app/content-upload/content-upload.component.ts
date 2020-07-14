import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContentUploadService } from './content-upload.service';
declare let $: any;

@Component({
  selector: 'app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [ ContentUploadService ]
})
export class ContentUploadComponent implements OnInit {
  public confirm: any;
  public form: FormGroup;

  constructor( public Service: ContentUploadService, private fb: FormBuilder ) { }

  ngOnInit(): void {
  }


  onSubmit( value ) {
    this.Service.saveformData( 'submit', value )
    .subscribe(
      data => this.confirm = data,
      err => console.log(),
      () => {
        if(this.confirm.successful){
          $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if(this.confirm.error){
          $('#modalAlertError').foundation('open');
        }
      }
    );
    
  }

}
