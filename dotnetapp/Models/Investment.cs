using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Models
{
    public class Investment
    {
        public int InvestmentId{get;set;}
        public string Name{get;set;}
        public string Description{get;set;}
        public decimal ExpectedReturn{get;set;}
        public string RiskLevel{get;set;}
        public int DurationInMonths{get;set;}
        public decimal MinimumInvestment{get;set;}
        public string InvestmentType{get;set;}
        public string DocumentsRequired{get;set;}
    }
}