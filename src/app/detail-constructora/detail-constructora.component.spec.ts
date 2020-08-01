import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConstructoraComponent } from './detail-constructora.component';

describe('DetailConstructoraComponent', () => {
  let component: DetailConstructoraComponent;
  let fixture: ComponentFixture<DetailConstructoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailConstructoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConstructoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
