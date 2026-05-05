
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  public apiUrl = 'https://8080-cedeeaeccfbfdedaaeaeadffdcafeaadedf.premiumproject.examly.io';
 
  constructor(private http: HttpClient) {}
 
  private getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }
 
  sendFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/api/Feedback`, feedback, this.getAuthHeaders());
  }
 
  getAllFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/Feedback/user/${userId}`, this.getAuthHeaders());
  }
 
  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Feedback/${feedbackId}`, this.getAuthHeaders());
  }
 
  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/Feedback`, this.getAuthHeaders());
  }
}