import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Investment } from 'src/app/models/investment.model';
import { InvestmentService } from 'src/app/services/investment.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-admineditinvestment',
  templateUrl: './admineditinvestment.component.html',
  styleUrls: ['./admineditinvestment.component.css']
})
export class AdmineditinvestmentComponent implements OnInit {
  investmentId: number;
  investment: Investment = {
    Name: '',
    Description: '',
    ExpectedReturn: 0,
    RiskLevel: '',
    DurationInMonths: 0,
    MinimumInvestment: 0,
    InvestmentType: '',
    DocumentsRequired: ''
  };
 
  showPopup = false;
 
  constructor(private ac: ActivatedRoute, private router: Router, private ser:InvestmentService) {}
 
  ngOnInit() {
    this.ac.params.subscribe(params => {
      this.investmentId = +params['id'];
      this.ser.getInvestmentById(this.investmentId).subscribe(res=>{
        this.investment=res
      })
     
    });
  }
 
  onUpdateInvestment() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this investment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ser.updateInvestment(this.investmentId, this.investment).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated',
              text: 'Investment updated successfully.'
            }).then(() => {
              this.router.navigate(['/viewInvestment']);
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: err.error?.message || 'Something went wrong.'
            });
          }
        });
      }
    });
  }
 
 
}