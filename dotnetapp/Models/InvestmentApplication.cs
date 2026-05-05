using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
// using dotnetapp.Properties;

namespace dotnetapp.Models
{
    public class InvestmentApplication
    {
        public int InvestmentApplicationId{get;set;}
        public int UserId{get;set;}
        public User? User{get;set;}
        public int InvestmentId{get;set;}
        public Investment? Investment{get;set;}
        public decimal InvestmentAmount{get;set;}
        public string ApplicationStatus{get;set;}
        public DateTime ApplicationDate{get;set;}
        public string InvestmentReason{get;set;}
        public int InvestmentDuration{get;set;}
        public string File{get;set;}
    }
}