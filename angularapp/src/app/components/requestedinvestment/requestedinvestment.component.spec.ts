import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestedinvestmentComponent } from './requestedinvestment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestedinvestmentComponent', () => {
  let component: RequestedinvestmentComponent;
  let fixture: ComponentFixture<RequestedinvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ RequestedinvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedinvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_requestedinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_investment_requests_for_approval_heading_in_the_requestedinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Investment Requests for Approval');
  });
});
