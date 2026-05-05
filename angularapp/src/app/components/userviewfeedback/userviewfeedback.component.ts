import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';
import { Feedback } from 'src/app/models/feedback.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view-feedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  isLoading = true;
  private userId: number = 0;
  private destroy$ = new Subject<void>();

  currentPage: number = 1;
  itemsPerPage: number = 10;


  constructor(
    private feedbackService: FeedbackService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.UserId;
      this.loadFeedbacks();
    } else {
      console.warn('User not logged in.');
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getAllFeedbacksByUserId(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.feedbacks = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching feedbacks:', err);
        this.isLoading = false;
      }
    });
  }

  showDeleteConfirmation(feedbackId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d9534f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFeedback(feedbackId);
      }
    });
  }

  private deleteFeedback(feedbackId: number): void {
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.FeedbackId !== feedbackId);
        Swal.fire('Deleted!', 'Your feedback has been successfully deleted.', 'success');
        this.loadFeedbacks();
      },
      error: (err) => {
        if (err.status === 200) {
          console.warn('Received 200 OK in error block, treating as success.');
          this.feedbacks = this.feedbacks.filter(f => f.FeedbackId !== feedbackId);
          Swal.fire('Deleted!', 'Your feedback has been successfully deleted.', 'success');
          this.loadFeedbacks();
        } else {
          console.error('Error deleting feedback:', err);
          Swal.fire('Error!', 'Could not delete the feedback. Please try again.', 'error');
        }
      }
    });
  }


  get paginatedFeedbacks(): Feedback[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.feedbacks.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.feedbacks.length / this.itemsPerPage);
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