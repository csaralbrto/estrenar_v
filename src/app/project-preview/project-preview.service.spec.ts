import { TestBed } from '@angular/core/testing';

import { ProjectPreviewService } from './project-preview.service';

describe('ProjectPreviewService', () => {
  let service: ProjectPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
