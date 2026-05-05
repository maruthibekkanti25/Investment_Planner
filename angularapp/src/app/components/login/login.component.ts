import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/login.model';
import { Subscription, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginData: Login = {
    Email: '',
    Password: ''
  };
 
  errorMessage: string = '';
  formSubmitted: boolean = false;
  isLocked: boolean = false;
  unlockCountdown: number = 0;
  private countdownSubscription: Subscription | undefined;
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {
   
  }
 
  ngOnDestroy(): void {
    this.unsubscribeCountdown();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
  
    if (this.isLocked) {
      this.errorMessage = `Account is locked. Please wait ${this.unlockCountdown} seconds.`;
      Swal.fire({
        icon: 'warning',
        title: 'Account Locked',
        text: this.errorMessage
      });
      return;
    }
  
    if (this.loginData.Email && this.loginData.Password) {
      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          this.isLocked = false;
          this.unsubscribeCountdown();
  
          const role = response.User?.UserRole;
  
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome ${role}!`,
            timer: 2000,
            showConfirmButton: false
          });
  
          if (role === 'Admin' || role === 'User') {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Unknown user role.';
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: this.errorMessage
            });
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.Message || 'Invalid email or password.';
          console.error('Login error:', this.errorMessage);
  
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: this.errorMessage
          });
  
          if (this.errorMessage.toLowerCase().includes('locked')) {
            this.isLocked = true;
            this.startCountdown(60); // Lock for 60 seconds
          }
        }
      });
    } else {
      this.errorMessage = 'Please enter both email and password.';
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: this.errorMessage
      });
    }
  }
 
  private startCountdown(seconds: number): void {
    this.unsubscribeCountdown();
    this.unlockCountdown = seconds;
 
    this.countdownSubscription = timer(0, 1000).pipe(
      takeWhile(() => this.unlockCountdown > 0)
    ).subscribe(() => {
      this.unlockCountdown--;
      if (this.unlockCountdown <= 0) {
        this.isLocked = false;
        this.unsubscribeCountdown();
      }
    });
  }
 
  private unsubscribeCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = undefined;
    }
  }
}