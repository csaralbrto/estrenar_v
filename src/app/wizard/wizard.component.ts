import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { WizardService } from './wizard.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [ WizardService ]
})
export class WizardComponent implements OnInit {
  public confirm: any;
  public form: FormGroup;

  constructor( public Service: WizardService, private fb: FormBuilder ) { }

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
