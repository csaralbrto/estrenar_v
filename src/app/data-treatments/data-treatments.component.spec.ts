import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTreatmentsComponent } from './data-treatments.component';

describe('DataTreatmentsComponent', () => {
  let component: DataTreatmentsComponent;
  let fixture: ComponentFixture<DataTreatmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTreatmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
