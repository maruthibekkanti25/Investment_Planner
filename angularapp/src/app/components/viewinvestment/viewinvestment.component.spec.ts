import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewinvestmentComponent } from './viewinvestment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewinvestmentComponent', () => {
  let component: ViewinvestmentComponent;
  let fixture: ComponentFixture<ViewinvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ ViewinvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_viewinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Investments_Plans_heading_in_the_viewinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Investment Plans');
  });
});
