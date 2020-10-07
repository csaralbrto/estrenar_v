import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
export class WizardComponent implements OnInit, AfterViewChecked {
  public confirm: any;
  public form: FormGroup;
  public responseSearchData: any;
  public results = false;
  arrayOptions: string[] = [];
  arrayOptions2: string[] = [];

  constructor(public Service: WizardService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // $(document).foundation();
    this.createForm();

    /* Método para obtener toda la info de proyectos */
    this.Service.getDataSearch().subscribe(
      (data) => (this.responseSearchData = data.data),
      (err) => console.log(),
      () => {
        if (this.responseSearchData) {
          // console.log(this.responseSearchData);
          for (let project of this.responseSearchData) {
            // console.log(project.name)
            this.arrayOptions.push(project.name);
          }
          console.log(this.arrayOptions);
          this.results = true;
        }
        /* si responde correctamente */
        if (this.responseSearchData.error) {
          /* si hay error en la respuesta */
        }
      }
    );
  }
  filterValues(value: string) {
    console.log('entre '+ value);
    const filterValue = value.toUpperCase();
    this.arrayOptions2 = [];
    this.arrayOptions2 = this.arrayOptions.filter(option => option.toUpperCase().includes(filterValue));
}
  closeWizard() {
    $('#welcomeModal').foundation('close');
  }

  changeStepWizard(idStep) {
    for (let index = 0; index <= 5; index++) {
      if (idStep == index) {
        $('#wizard' + index).removeAttr('style');
        console.log(index + '-muestro este item ');
      } else {
        console.log(index + '-oculto este item ');
        $('#wizard' + index).css('display', 'none');
      }
    }
  }


  onSubmit(value) {
    this.Service.saveformData('submit', value).subscribe(
      (data) => (this.confirm = data),
      (err) => console.log(),
      () => {
        if (this.confirm) {
          // $('#modalAlertSuccessful').foundation('open');
          this.form.reset();
        }
        if (this.confirm.error) {
          // $('#modalAlertError').foundation('open');
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
  ngAfterViewChecked() {
    if (this.results) {
      $('app-wizard').foundation();
      // $('html,body').scrollTop(0);
    }
  }
}
