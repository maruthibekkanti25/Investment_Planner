import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Investment } from 'src/app/models/investment.model';
import { InvestmentService } from 'src/app/services/investment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewinvestment',
  templateUrl: './viewinvestment.component.html',
  styleUrls: ['./viewinvestment.component.css']
})

export class ViewinvestmentComponent implements OnInit {
  searchType = '';
  investmentPlans: Investment[] = [];
  filteredPlans: Investment[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(public ser: InvestmentService, public rt: Router) {}
  investmentIdsWithApplications: Set<number> = new Set();

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.ser.getAllInvestments().subscribe(res => {
      this.investmentPlans = res;
      this.filteredPlans = res;
    });
  
    this.ser.getAllInvestmentApplications().subscribe(applications => {
      this.investmentIdsWithApplications = new Set(applications.map(app => app.InvestmentId));
    });
  }
  

  onSearch() {
    this.currentPage = 1; // Reset to first page on new search
    this.filteredPlans = this.investmentPlans.filter(plan =>
      plan.InvestmentType.toLowerCase().includes(this.searchType.toLowerCase())
    );
  }

  get paginatedPlans(): Investment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPlans.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPlans.length / this.itemsPerPage);
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

  editPlan(plan: Investment) {
    this.rt.navigate([`/adminEditInvestment/${plan.InvestmentId}`]);
  }

  deletePlan(plan: Investment) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete "${plan.Name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ser.deleteInvestment(plan.InvestmentId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The investment has been deleted.', 'success');
            this.loadPlans(); 
          },
          error: (err) => {
            if (err.status === 200) {
              console.warn('Received 200 OK in error block, treating as success.');
              Swal.fire('Deleted!', 'The investment has been deleted.', 'success');
              this.loadPlans();
            } else {
              console.error('Error deleting investment:', err);
              Swal.fire('Error!', 'Could not delete the investment.', 'error');
            }
          }
        });
      }
    });
  }  

  handleDelete(plan: Investment): void {
    if (this.investmentIdsWithApplications.has(plan.InvestmentId!)) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete',
        text: 'This investment has applications and cannot be deleted.',
        confirmButtonText: 'OK'
      });
    } else {
      this.deletePlan(plan); 
    }
  }
  handleEdit(plan: Investment): void {
    if (this.investmentIdsWithApplications.has(plan.InvestmentId!)) {
      Swal.fire({
        icon: 'info',
        title: 'Edit Restricted',
        text: 'This investment has applications and cannot be edited.',
        confirmButtonText: 'OK'
      });
    } else {
      this.editPlan(plan); 
    }
  }
  
}
