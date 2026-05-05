import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CreateinvestmentComponent } from './createinvestment.component';
import { InvestmentService } from 'src/app/services/investment.service';
import { Router } from '@angular/router';

describe('CreateInvestmentComponent', () => {
  let component: CreateinvestmentComponent;
  let fixture: ComponentFixture<CreateinvestmentComponent>;
  let investmentService: jasmine.SpyObj<InvestmentService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['addInvestment']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CreateinvestmentComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: InvestmentService, useValue: investmentServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateinvestmentComponent);
    component = fixture.componentInstance;
    investmentService = TestBed.inject(InvestmentService) as jasmine.SpyObj<InvestmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  fit('Frontend_should_create_createinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_create_new_investment_heading_in_the_createinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Investment');
  });

});
