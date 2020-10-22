import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ContentUploadService } from './content-upload.service';
declare let $: any;

@Component({
  selector: 'app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [ContentUploadService],
})
export class ContentUploadComponent implements OnInit {
  public confirm: any;
  public form: FormGroup;

  constructor(public Service: ContentUploadService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    $('app-content-upload').foundation();
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
      name_proyect: new FormControl(''),
      company_constructor: new FormControl(''),
      type_property: new FormControl(''),
      status_project: new FormControl(''),
      date_of_delivery: new FormControl(''),
      city: new FormControl(''),
      zone: new FormControl(''),
      sector: new FormControl(''),
      address_project: new FormControl(''),
      address_room_sales: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      stratum: new FormControl(''),
      bank: new FormControl(''),
      logo_project: new FormControl(''),
      url_video: new FormControl(''),
      project_characteristics: new FormControl(''),
      number_towers: new FormControl(''),
      floors_towers: new FormControl(''),
      apartments_towers: new FormControl(''),
      elevator_towers: new FormControl(''),
      characteristics_environment: new FormControl(''),
      colection: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      check_whatsapp: new FormControl(''),
      dayTimeAtention: new FormControl(''),
      hour: new FormControl('Seleccione'),
      schedule: new FormControl('Seleccione'),
      specification: new FormControl(''),
      contact: new FormControl('Deseas ser contactado'),
      label_price: new FormControl(''),
      initial_fee: new FormControl(''),
      price_from: new FormControl(''),
      separation: new FormControl(''),
      constructed_area: new FormControl(''),
      private_area: new FormControl(''),
      type_of_property: new FormControl(''),
      finishes: new FormControl(''),
      maps: new FormControl(''),
      images_property: new FormControl(''),
      video_property: new FormControl(''),
      levels_property: new FormControl(''),
      tour: new FormControl(''),
      bedrooms: new FormControl(''),
      bathrooms: new FormControl(''),
      social_bathrooms: new FormControl(''),
      garages: new FormControl(''),
      type_garages: new FormControl(''),
      dining_room: new FormControl(''),
      property_characteristics: new FormControl(''),
      balcony_area: new FormControl(''),
      immediate_delivery: new FormControl(''),
      additional_comments: new FormControl(''),
      typology: new FormControl(''),
    });
  }
  changeStepWizard(idStep) {
    console.log('entre');
    for (let index = 0; index <= 5; index++) {
      if (idStep == index) {
        $('#upload' + index).removeAttr('style');
        // console.log(index + '-muestro este item ');
      } else {
        // console.log(index + '-oculto este item ');
        $('#upload' + index).css('display', 'none');
      }
    }
  }
}
