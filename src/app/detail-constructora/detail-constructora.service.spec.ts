import { TestBed } from '@angular/core/testing';

import { DetailConstructoraService } from './detail-constructora.service';

describe('DetailConstructoraService', () => {
  let service: DetailConstructoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailConstructoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
