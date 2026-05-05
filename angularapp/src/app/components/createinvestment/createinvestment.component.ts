import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Investment } from 'src/app/models/investment.model';
import { InvestmentService } from 'src/app/services/investment.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-createinvestment',
  templateUrl: './createinvestment.component.html',
  styleUrls: ['./createinvestment.component.css'],
})
export class CreateinvestmentComponent {
  investment: Partial<Investment> = {};
  existingInvestmentTypes: Set<string> = new Set(['Stocks', 'Bonds', 'Real Estate']);
  successMessage: string | null = null;
 
  constructor(private investmentService: InvestmentService, private router: Router) {}
 
  onSubmit(form: NgForm): void {
    if (!form.valid || !this.isValidInvestment()) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched(); // Show validation errors
      });
  
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please ensure all fields are filled correctly and values are non-negative.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
  
      return;
    }
  
    const newInvestmentType = this.investment.InvestmentType?.trim();
  
    if (newInvestmentType && this.existingInvestmentTypes.has(newInvestmentType)) {
      Swal.fire({
        title: 'Duplicate Investment Type',
        text: `Investment with type "${newInvestmentType}" already exists.`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const newInvestment: Investment = this.investment as Investment;
  
    this.investmentService.addInvestment(newInvestment).subscribe({
      next: (response) => {
        this.existingInvestmentTypes.add(newInvestment.InvestmentType);
  
        Swal.fire({
          title: 'Investment Created!',
          text: 'Your investment has been added successfully.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/viewInvestment']);
          this.resetForm();
        });
      },
      error: (err) => {
        console.error('Error adding investment:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to create investment. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
  isValidInvestment(): boolean {
    return (
      !!this.investment.Name &&
      !!this.investment.Description &&
      (this.investment.ExpectedReturn ?? 0) > 0 &&
      (this.investment.DurationInMonths ?? 0) > 0 &&
      (this.investment.MinimumInvestment ?? 0) > 0 &&
      ['Low', 'Medium', 'High'].includes(this.investment.RiskLevel ?? '') &&
      !!this.investment.InvestmentType &&
      !!this.investment.DocumentsRequired
    );
  }
 
  showPopup(id: string): void {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = 'flex';
    setTimeout(() => this.closePopup(id), 3000);
  }
 
  closePopup(id: string): void {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = 'none';
  }
 
  resetForm() {
    this.investment = {};
  }
}