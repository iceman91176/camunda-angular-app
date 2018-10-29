import { TestBed, inject } from '@angular/core/testing';

import { FormioService } from './formio.service';

describe('FormioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormioService]
    });
  });

  it('should be created', inject([FormioService], (service: FormioService) => {
    expect(service).toBeTruthy();
  }));
});
