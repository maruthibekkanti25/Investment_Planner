import { Component, OnInit } from '@angular/core';
import { InvestmentService } from 'src/app/services/investment.service';
import { InvestmentApplication } from 'src/app/models/investmentapplication.model';
import { Investment } from 'src/app/models/investment.model';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-requestedinvestment',
  templateUrl: './requestedinvestment.component.html',
  styleUrls: ['./requestedinvestment.component.css']
})
export class RequestedinvestmentComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  searchType = '';
  filterStatus = '';
  showModal = false;
  selectedRequest: any = null;
  safeFileUrl: SafeResourceUrl | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  safePreviewUrl: SafeResourceUrl;

  constructor(private investmentService: InvestmentService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests(): void {
    this.investmentService.getAllInvestments().subscribe({
      next: (investments: Investment[]) => {
        this.investmentService.getAllInvestmentApplications().subscribe({
          next: (applications: InvestmentApplication[]) => {
            this.requests = applications.map(app => {
              const investment = investments.find(inv => inv.InvestmentId === app.InvestmentId);
              return {
                ...app,
                investmentType: investment?.InvestmentType || 'Unknown',
                username: `User ${app.UserId}`,
                proofImage: app.File
              };
            });
            this.filteredRequests = [...this.requests];
          },
          error: (err) => {
            console.error('Error fetching investment applications:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching investments:', err);
      }
    });
  }

  searchByType(): void {
    const typeFiltered = this.requests.filter(req =>
      req.investmentType.toLowerCase().includes(this.searchType.toLowerCase())
    );

    if (this.filterStatus === '') {
      this.filteredRequests = typeFiltered;
    } else {
      this.filteredRequests = typeFiltered.filter(req =>
        req.ApplicationStatus.toLowerCase() === this.filterStatus.toLowerCase()
      );
    }
  }


  applyStatusFilter(): void {
    if (this.filterStatus === '') {
      this.filteredRequests = [...this.requests];
      this.searchByType(); 
    } else {
      this.filteredRequests = this.requests.filter(req =>
        req.ApplicationStatus.toLowerCase() === this.filterStatus.toLowerCase()
      );
      this.searchByType(); 
    }
  }


  approveRequest(request: any): void {
    Swal.fire({
      title: 'Approve Request?',
      text: 'Are you sure you want to approve this investment application?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        const updatedRequest: InvestmentApplication = {
          ...request,
          ApplicationStatus: 'Approved'
        };
        this.investmentService.updateApplicationStatus(request.InvestmentApplicationId.toString(), updatedRequest).subscribe({
          next: () => {
            Swal.fire('Approved!', 'The request has been approved.', 'success');
            this.loadRequests(); 
          },
          error: err => {
            if (err.status === 200) {
              Swal.fire('Approved!', 'The request has been approved.', 'success');
              this.loadRequests(); 
            } else {
              console.error('Error approving request:', err);
              Swal.fire('Error', 'Could not approve the request.', 'error');
            }
          }
        });
      }
    });
  }


  rejectRequest(request: any): void {
    Swal.fire({
      title: 'Reject Request?',
      text: 'Are you sure you want to reject this investment application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        const updatedRequest: InvestmentApplication = {
          ...request,
          ApplicationStatus: 'Rejected'
        };
        this.investmentService.updateApplicationStatus(request.InvestmentApplicationId.toString(), updatedRequest).subscribe({
          next: () => {
            Swal.fire('Rejected!', 'The request has been rejected.', 'success');
            this.loadRequests(); 
          },
          error: err => {
            if (err.status === 200) {
              Swal.fire('Rejected!', 'The request has been rejected.', 'success');
              this.loadRequests();
            } else {
              console.error('Error rejecting request:', err);
              Swal.fire('Error', 'Could not reject the request.', 'error');
            }
          }
        });
      }
    });
  }


  showMore(request: any): void {
    this.selectedRequest = request;
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustUrl(request.File);
    this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(request.File);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRequest = null;
  }



  get paginatedRequests(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRequests.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
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