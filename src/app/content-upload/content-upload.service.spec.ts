import { TestBed } from '@angular/core/testing';

import { ContentUploadService } from './content-upload.service';

describe('ContentUploadService', () => {
  let service: ContentUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
