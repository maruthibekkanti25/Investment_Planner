import { Investment } from "./investment.model"
import { User } from "./user.model"

export interface InvestmentApplication{
    InvestmentApplicationId?:number,
    UserId:number,
    User?:User,
    InvestmentId:number,
    Investment?:Investment,
    InvestmentAmount:number,
    ApplicationStatus:string,
    ApplicationDate:string,
    InvestmentReason:string,
    InvestmentDuration:number,
    File:string
}