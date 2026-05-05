import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentformComponent } from './investmentform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InvestmentformComponent', () => {
  let component: InvestmentformComponent;
  let fixture: ComponentFixture<InvestmentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule , HttpClientTestingModule],
      declarations: [ InvestmentformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_investmentform_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_investment_application_form_heading_in_the_investmentform_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Investment Application Form');
  });
});
