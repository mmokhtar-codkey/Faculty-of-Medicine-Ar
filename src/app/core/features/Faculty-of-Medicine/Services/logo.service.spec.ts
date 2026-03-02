/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogoService } from './logo.service';

describe('Service: Logo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogoService]
    });
  });

  it('should ...', inject([LogoService], (service: LogoService) => {
    expect(service).toBeTruthy();
  }));
});
