import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-add-feedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {

  userId: number = 0;
  feedbackText: string = '';
  submitted: boolean = false;
  successMessage: string = '';
  showValidationError: boolean = false;

  constructor(
    private service: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.UserId;
      console.log('User ID:', this.userId);
    } else {
      console.warn('No user is currently logged in.');
    }
  }

  onSubmit(): void {
    this.submitted = true;

    const trimmedFeedback = this.feedbackText.trim();
    const isValidFeedback = trimmedFeedback.length > 0 && /^[a-zA-Z0-9\s]+$/.test(trimmedFeedback);

    if (!isValidFeedback) {
      this.showValidationError = true;
      Swal.fire({
        title: 'Failed to add feedback!',
        text: 'Feedback must not be empty and should contain only letters, numbers, and spaces.',
        icon: 'error',
        allowOutsideClick: false,
      });
      return;
    }

    const feedback: Feedback = {
      UserId: this.userId,
      FeedbackText: trimmedFeedback,
      Date: new Date()
    };

    this.service.sendFeedback(feedback).subscribe({
      next: () => {
        this.showValidationError = false;
        this.feedbackText = '';
        this.submitted = false;

        Swal.fire({
          title: 'Feedback Submitted Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false
        }).then(() => {
          this.router.navigate(['/userViewFeedback']);
        });
      },
      error: (error) => {
        if (error.status === 200) {
          console.warn('Received 200 OK in error block, treating as success.');
          Swal.fire({
            title: 'Feedback Submitted Successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/userViewFeedback']);
          });
        } else {
          console.error('Error submitting feedback:', error);
          Swal.fire({
            title: 'Submission Failed',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            allowOutsideClick: false
          });
        }
      }
    });
  }

  closePopup(): void {
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/userViewFeedback']);
  }
}