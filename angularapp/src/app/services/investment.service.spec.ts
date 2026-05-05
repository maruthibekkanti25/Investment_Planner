
import { TestBed } from '@angular/core/testing';

import { InvestmentService } from './investment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InvestmentService', () => {
  let service: InvestmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(InvestmentService);
  });

  fit('Frontend_should_create_investment_service', () => {
    expect(service).toBeTruthy();
  });
});
