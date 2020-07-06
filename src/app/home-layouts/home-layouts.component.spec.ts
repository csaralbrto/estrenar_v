import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLayoutsComponent } from './home-layouts.component';

describe('HomeLayoutsComponent', () => {
  let component: HomeLayoutsComponent;
  let fixture: ComponentFixture<HomeLayoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLayoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
