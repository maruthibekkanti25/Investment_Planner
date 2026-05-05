import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { InvestmentService } from 'src/app/services/investment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentApplication } from 'src/app/models/investmentapplication.model';

@Component({
  selector: 'app-userviewinvestment',
  templateUrl: './userviewinvestment.component.html',
  styleUrls: ['./userviewinvestment.component.css']
})
export class UserviewinvestmentComponent implements OnInit {
  userId: number | null = null;
  investments: any[] = [];
  paginatedInvestments: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;

  appliedInvestmentIds: number[] = [];

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    public investService: InvestmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.UserId;
      this.fetchUserInvestments();
      this.fetchAppliedInvestments();
    } else {
      console.warn('No user is currently logged in.');
    }
  }

  fetchUserInvestments(): void {
    this.investService.getAllInvestments().subscribe({
      next: (res) => {
        this.investments = res;
        this.updatePaginatedInvestments();
      },
      error: (err) => {
        console.error('Failed to fetch investments:', err);
      }
    });
  }

  fetchAppliedInvestments(): void {
    if (!this.userId) return;

    this.investService.getAppliedInvestments(this.userId.toString()).subscribe({
      next: (applications: InvestmentApplication[]) => {
        this.appliedInvestmentIds = applications.map(app => app.InvestmentId);
      },
      error: (err) => {
        console.error('Failed to fetch applied investments:', err);
      }
    });
  }

  updatePaginatedInvestments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInvestments = this.investments.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.investments.length) {
      this.currentPage++;
      this.updatePaginatedInvestments();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedInvestments();
    }
  }

  applyInvestment(investment: any): void {
    if (this.appliedInvestmentIds.includes(investment.InvestmentId)) {
      return; 
    }

    console.log("Apply Button Clicked");
    console.log(investment);

    this.router.navigate([`/investmentForm/${investment.InvestmentId}`]);
  }
}