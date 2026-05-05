import { Component, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {
  username: string = '';
  role: string = '';
  isLoggedIn: boolean = false;
  public ser: AuthService;

  constructor(public authService: AuthService, @Optional() private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn(); 
    this.ser = authService;
  }

 
  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your admin session.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Inside Admin LogOut()");
        this.authService.logout();
        this.router.navigate(['/login']);
        Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
      }
    });
  }
  

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.username = currentUser.Username;
      this.role = currentUser.UserRole || 'Admin';
    }
  }
}
