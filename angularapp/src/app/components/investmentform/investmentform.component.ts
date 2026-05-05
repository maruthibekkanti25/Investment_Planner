import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentService } from 'src/app/services/investment.service';
import { InvestmentApplication } from 'src/app/models/investmentapplication.model';
import Swal from 'sweetalert2';
import { Investment } from 'src/app/models/investment.model';

@Component({
  selector: 'app-investmentform',
  templateUrl: './investmentform.component.html',
  styleUrls: ['./investmentform.component.css']
})
export class InvestmentformComponent implements OnInit {
  investmentForm!: FormGroup;
  selectedFile: File | null = null;
  userId: number = 0;
  investmentId: number = 0;
  investmentDetails!: Investment;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Investment Form Component");

    
    this.investmentForm = this.fb.group({
      InvestmentAmount: [0, [Validators.required]],
      InvestmentDuration: [0, [Validators.required, this.nonNegativeValidator()]],
      InvestmentReason: ['', [Validators.required, this.nonWhitespaceValidator()]],
      File: [null, Validators.required]
    });

    
    this.route.params.subscribe(params => {
      const investmentIdParam = params['investmentId'];
      if (investmentIdParam) {
        this.investmentId = Number(investmentIdParam);
        console.log("Investment ID from route:", this.investmentId);

       
        this.investmentService.getInvestmentById(this.investmentId).subscribe({
          next: (investment: Investment) => {
            this.investmentDetails = investment;

          
            this.investmentForm.patchValue({
              InvestmentAmount: investment.MinimumInvestment
            });

            
            const amountControl = this.investmentForm.get('InvestmentAmount');
            if (amountControl) {
              amountControl.setValidators([
                Validators.required,
                this.minimumInvestmentValidator(investment.MinimumInvestment)
              ]);
              amountControl.updateValueAndValidity();
            }
          },
          error: (err) => {
            console.error('Error fetching investment details:', err);
          }
        });
      }
    });

   
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.UserId;
    }
  }

  minimumInvestmentValidator(minAmount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== null && control.value < minAmount) {
        return { belowMinimum: true };
      }
      return null;
    };
  }

  
  nonNegativeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== null && control.value < 0) {
        return { negativeDuration: true };
      }
      return null;
    };
  }

  
  nonWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.investmentForm.patchValue({ File: this.selectedFile });
  }

  async onSubmit(): Promise<void> {
    if (this.investmentForm.valid) {
      let fileBase64 = '';
      if (this.selectedFile) {
        fileBase64 = await this.convertFileToBase64(this.selectedFile);
      }

      const application: InvestmentApplication = {
        UserId: this.userId,
        InvestmentId: this.investmentId,
        InvestmentAmount: this.investmentForm.value.InvestmentAmount,
        InvestmentDuration: this.investmentForm.value.InvestmentDuration,
        InvestmentReason: this.investmentForm.value.InvestmentReason,
        ApplicationStatus: 'Pending',
        File: fileBase64,
        ApplicationDate: new Date().toISOString()
      };

      this.investmentService.addInvestmentApplication(application).subscribe({
        next: (response) => {
          console.log('Investment application submitted successfully:', response);
          Swal.fire({
            title: 'Application Submitted!',
            text: 'Your investment application has been submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/userAppliedInvestment']);
          });
        },
        error: (error) => {
          if (error.status === 200) {
            console.warn('Received 200 OK in error block, treating as success.');
            Swal.fire({
              title: 'Application Submitted!',
              text: 'Your investment application has been submitted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/userAppliedInvestment']);
            });
          } else {
            console.error('Error submitting investment application:', error);
            Swal.fire({
              title: 'Submission Failed',
              text: 'There was an error submitting your application. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
    } else {
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill out all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}