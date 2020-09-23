import { TestBed } from '@angular/core/testing';

import { GlosoryService } from './glosory.service';

describe('GlosoryService', () => {
  let service: GlosoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlosoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
