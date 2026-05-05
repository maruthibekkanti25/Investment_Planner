import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewinvestmentComponent } from './userviewinvestment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserviewinvestmentComponent', () => {
  let component: UserviewinvestmentComponent;
  let fixture: ComponentFixture<UserviewinvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserviewinvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewinvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userviewinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_available_investment_plans_heading_in_the_userviewinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Investment Plans');
  });
});
