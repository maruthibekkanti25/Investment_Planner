import { Component, OnInit } from '@angular/core';
import { InvestmentService } from 'src/app/services/investment.service';
import { InvestmentApplication } from 'src/app/models/investmentapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import { Investment } from 'src/app/models/investment.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userappliedinvestment',
  templateUrl: './userappliedinvestment.component.html',
  styleUrls: ['./userappliedinvestment.component.css']
})
export class UserappliedinvestmentComponent implements OnInit {
  appliedInvestments: InvestmentApplication[] = [];
  userId: number = 0;
  allInvestments: Investment[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private investmentService: InvestmentService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.UserId;
      this.loadAppliedInvestments();
      this.loadAllInvestments();
    }
  }

  loadAllInvestments(): void {
    this.investmentService.getAllInvestments().subscribe({
      next: (data) => {
        this.allInvestments = data;
      },
      error: (err) => {
        console.error('Error loading investments:', err);
      }
    });
  }


  loadAppliedInvestments(): void {
    this.investmentService.getAppliedInvestments(this.userId.toString()).subscribe({
      next: (data) => {
        this.appliedInvestments = data;
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('Received 200 OK in error block, treating as empty list.');
          this.appliedInvestments = []; // ✅ Treat as no data
        } else {
          console.error('Error loading applied investments:', err);
        }
      }
    });
  }

  deleteApplication(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.investmentService.deleteInvestmentApplication(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your application has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAppliedInvestments();
          },
          error: (err) => {
            if (err.status === 200) {
              console.warn('Received 200 OK in error block, treating as success.');
              Swal.fire({
                title: 'Deleted!',
                text: 'Your application has been deleted successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadAppliedInvestments();
            } else {
              console.error('Error deleting application:', err);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the application. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        });
      }
    });
  }

  getInvestmentNameById(id: number): string {
    const investment = this.allInvestments.find(inv => inv.InvestmentId === id);
    return investment ? investment.Name : 'Unknown';
  }


  get paginatedApplications(): InvestmentApplication[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.appliedInvestments.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.appliedInvestments.length / this.itemsPerPage);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

}