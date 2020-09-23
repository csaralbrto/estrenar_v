import { TestBed } from '@angular/core/testing';

import { DataTreatmentsService } from './data-treatments.service';

describe('DataTreatmentsService', () => {
  let service: DataTreatmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTreatmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
