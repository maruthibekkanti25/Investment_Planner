import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user: User = {
    UserId: 0,
    Email: '',
    Password: '',
    Username: '',
    MobileNumber: '',
    UserRole: 'User'
  };

  adminKey: string = '';
  confirmPassword: string = '';
  formSubmitted: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }


  onSubmit(registrationForm: any): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (registrationForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      return;
    }

    if (this.user.Password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.user.UserRole === 'Admin' && !this.adminKey) {
      this.errorMessage = 'Please provide the Admin secret key.';
      return;
    }

    this.authService.register(this.user, this.adminKey).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Redirecting to login...',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        const message = err.error?.Message || err.error?.message || 'Registration failed. Please try again.';

        if (message.includes('Mobile number already exists')) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Mobile Number',
            text: 'This mobile number is already registered. Please use a different one.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: message
          });
        }

        this.formSubmitted = false;
      }
    });
  }

}