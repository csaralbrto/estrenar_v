import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlosoryComponent } from './glosory.component';

describe('GlosoryComponent', () => {
  let component: GlosoryComponent;
  let fixture: ComponentFixture<GlosoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlosoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlosoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
