import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { WizardService } from './wizard.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [WizardService],
})
export class WizardComponent implements OnInit {
  public confirm: any;
  public form: FormGroup;

  constructor(public Service: WizardService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    $(document).foundation();
  }

  changeStepWizard(idStep) {
    for (let index = 0; index <= 6; index++) {
      if (idStep == index) {
        $('#wizard' + index).removeAttr('style');
        console.log(index + '-muestro este item ');
      } else {
        console.log(index + '-oculto este item ');
        $('#wizard' + index).css('display', 'none');
      }
    }
  }

  closeWizard() {
    $('#welcomeModal').foundation('close');
  }

  onSubmit(value) {
    this.Service.saveformData('submit', value).subscribe(
      (data) => (this.confirm = data),
      (err) => console.log(),
      () => {
        if (this.confirm.successful) {
          $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if (this.confirm.error) {
          $('#modalAlertError').foundation('open');
        }
      }
    );
  }
  createForm() {
    this.form =  this.formBuilder.group({
      search: new FormControl(''),
      budget_from: new FormControl(''),
      budget_to: new FormControl(''),
      purchase_budget: new FormControl(''),
      subsidyYes: new FormControl(''),
      subsidyNo: new FormControl(''),
      waitTime: new FormControl(''),
      contactType: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      typeSearch: new FormControl(''),
    });
  }
}
