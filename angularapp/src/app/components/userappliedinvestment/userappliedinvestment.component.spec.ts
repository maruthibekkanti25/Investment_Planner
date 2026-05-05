import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappliedinvestmentComponent } from './userappliedinvestment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserappliedinvestmentComponent', () => {
  let component: UserappliedinvestmentComponent;
  let fixture: ComponentFixture<UserappliedinvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserappliedinvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappliedinvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userappliedinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_applied_investments_heading_in_the_userappliedinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Applied Investments');
  });
});
