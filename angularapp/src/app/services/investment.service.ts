import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Investment } from '../models/investment.model';
import { InvestmentApplication } from '../models/investmentapplication.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  public apiUrl='https://8080-cedeeaeccfbfdedaaeaeadffdcafeaadedf.premiumproject.examly.io'

  constructor(public ser:HttpClient) { }

  getAllInvestments():Observable<Investment[]>{
    return this.ser.get<Investment[]>(`${this.apiUrl}/api/investment`)
  }
 
  deleteInvestment(investmentId:number):Observable<void>{
    return this.ser.delete<void>(`${this.apiUrl}/api/investment/${investmentId}`)
  }
 
  getInvestmentById(Id:number):Observable<Investment>{
    return this.ser.get<Investment>(`${this.apiUrl}/api/investment/${Id}`)
  }
 
  addInvestment(Object: Investment): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'text' as 'json'
    };
    return this.ser.post<any>(`${this.apiUrl}/api/investment`, Object, headers);
  }
 
  updateInvestment(id:number,requestObject:Investment):Observable<Investment>{
    return this.ser.put<Investment>(`${this.apiUrl}/api/investment/${id}`,requestObject)
  }

  getAppliedInvestments(userId:string):Observable<InvestmentApplication[]>{
    return this.ser.get<InvestmentApplication[]>(`${this.apiUrl}/api/InvestmentApplication/user/${userId}`)
  }

  deleteInvestmentApplication(investmentId :string):Observable<void>{
    return this.ser.delete<void>(`${this.apiUrl}/api/InvestmentApplication/${investmentId}`)
  }

  addInvestmentApplication(data:InvestmentApplication):Observable<InvestmentApplication>{
    return this.ser.post<InvestmentApplication>(`${this.apiUrl}/api/InvestmentApplication`,data)
  }

  getAllInvestmentApplications():Observable<InvestmentApplication[]>{
    return this.ser.get<InvestmentApplication[]>(`${this.apiUrl}/api/InvestmentApplication`)
  }

  updateApplicationStatus(id:string,investmentApplication : InvestmentApplication):Observable<InvestmentApplication>{
    return this.ser.put<InvestmentApplication>(`${this.apiUrl}/api/InvestmentApplication/${id}`,investmentApplication)
  }


}
