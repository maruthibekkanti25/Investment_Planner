import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { tap, map } from 'rxjs/operators';
import * as forge from 'node-forge';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public baseUrl = 'https://8080-cedeeaeccfbfdedaaeaeadffdcafeaadedf.premiumproject.examly.io/api';
  public currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  public isLoggedIn$: Observable<boolean>;
  public userRole$: Observable<string | null>;
  private publicKeyPem: string = '';
 
  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.currentUserSubject.asObservable().pipe(map(user => !!user));
    this.userRole$ = this.currentUserSubject.asObservable().pipe(map(user => user?.UserRole || null));
 
    // Fetch RSA public key
    this.http.get(`${this.baseUrl}/public-key`, { responseType: 'text' })
      .subscribe(key => this.publicKeyPem = key);
  }
 
  private encryptData(data: string): string {
    const publicKey = forge.pki.publicKeyFromPem(this.publicKeyPem);
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  }
 
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
 
  register(newUser: User, adminKey?: string): Observable<any> {
    let httpOptions = {};
    if (newUser.UserRole === 'Admin' && adminKey) {
      httpOptions = {
        headers: new HttpHeaders({ 'X-Admin-Key': adminKey })
      };
    }
 
    const encryptedUser = {
      ...newUser,
      Email: this.encryptData(newUser.Email),
      Password: this.encryptData(newUser.Password),
    
      
 
    };
 
    return this.http.post(`${this.baseUrl}/register`, encryptedUser, httpOptions);
  }
 
  login(loginData: Login): Observable<any> {
    const encryptedLogin = {
      Email: this.encryptData(loginData.Email),
      Password: this.encryptData(loginData.Password)
    };
 
    return this.http.post<{ token: string; User: User }>(`${this.baseUrl}/login`, encryptedLogin).pipe(
      tap(response => {
        const token = response.token;
        const user = response.User;
        if (token && user) {
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
 
  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.UserRole : null;
  }
 
  getUserId(): number | null {
    const user = this.currentUserValue;
    return user ? user.UserId : null;
  }
 
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }
 
  isUser(): boolean {
    return this.getUserRole() === 'User';
  }
 
  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
 
  getUserInfo(): { id: number, username: string } {
    const user = this.currentUserValue;
    return {
      id: user ? user.UserId : 0,
      username: user ? user.Username : ''
    };
  }
}