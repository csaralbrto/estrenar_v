import { TestBed } from '@angular/core/testing';

import { LegalNoticeService } from './legal-notice.service';

describe('LegalNoticeService', () => {
  let service: LegalNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
