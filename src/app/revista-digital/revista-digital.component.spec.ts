import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistaDigitalComponent } from './revista-digital.component';

describe('RevistaDigitalComponent', () => {
  let component: RevistaDigitalComponent;
  let fixture: ComponentFixture<RevistaDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevistaDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevistaDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
