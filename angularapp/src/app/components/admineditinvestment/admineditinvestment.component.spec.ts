
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdmineditinvestmentComponent } from './admineditinvestment.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdmineditinvestmentComponent', () => {
  let component: AdmineditinvestmentComponent;
  let fixture: ComponentFixture<AdmineditinvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule , HttpClientTestingModule , FormsModule],
      declarations: [ AdmineditinvestmentComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            snapshot: {
              paramMap: {
                get: () => '123',  
              },
            },
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmineditinvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_admineditinvestment_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_edit_investment_heading_in_the_admineditinvestment_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Edit Investment');
  }); 



});
