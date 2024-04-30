import { TestBed } from '@angular/core/testing';

import { LicenceGenerateService } from './licence-generate.service';

describe('LicenceGenerateService', () => {
  let service: LicenceGenerateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenceGenerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
