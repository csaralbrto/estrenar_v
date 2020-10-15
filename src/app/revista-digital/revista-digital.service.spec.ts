import { TestBed } from '@angular/core/testing';

import { RevistaDigitalService } from './revista-digital.service';

describe('RevistaDigitalService', () => {
  let service: RevistaDigitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevistaDigitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
