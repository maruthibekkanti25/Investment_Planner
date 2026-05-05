using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Exceptions;
namespace dotnetapp.Services
{
    public class InvestmentService
    {
        ApplicationDbContext db;
        public InvestmentService(ApplicationDbContext db1)
        {
            db = db1;
        }
 
        public async Task<IEnumerable<Investment>> GetAllInvestments()
        {
 
            return await db.Investments.ToListAsync();
        }
 
        public async Task<Investment> GetInvestmentById(int investmentId)
        {
 
            return await db.Investments.FindAsync(investmentId);
        }
 
        public async Task<bool> AddInvestment(Investment investment)
        {
            var res = await db.Investments.FirstOrDefaultAsync(r => r.InvestmentType == investment.InvestmentType);
            if (res != null)
            {
                throw new InvestmentException("Investment with the same type already exists");
            }
 
            db.Investments.Add(investment);
            await db.SaveChangesAsync();
            return true;
        }
 
        public async Task<bool> UpdateInvestment(int investmentId, Investment investment)
        {
            var res = await db.Investments.FirstOrDefaultAsync(r => r.InvestmentId == investmentId);
            if (res == null)
            {
                return false;
            }
 
            var res1 = await db.Investments.FirstOrDefaultAsync(r => r.InvestmentType == investment.InvestmentType && r.InvestmentId != investmentId);
            if (res1 != null)
            {
                throw new InvestmentException("Investment with the same type already exists");
            }
 
            res.Name = investment.Name;
            res.Description = investment.Description;
            res.ExpectedReturn = investment.ExpectedReturn;
            res.RiskLevel = investment.RiskLevel;
            res.DurationInMonths = investment.DurationInMonths;
            res.MinimumInvestment = investment.MinimumInvestment;
            res.InvestmentType = investment.InvestmentType;
            res.DocumentsRequired = investment.DocumentsRequired;
 
            await db.SaveChangesAsync();
            return true;
        }
 
        public async Task<bool> DeleteInvestment(int investmentId)
        {
            var res = await db.Investments.FindAsync(investmentId);
            if (res == null)
            {
                return false;
            }
 
            bool isReferenced = await db.InvestmentApplications.AnyAsync(r => r.InvestmentId == investmentId);
 
            if (isReferenced)
            {
                throw new InvestmentException("Investment cannot be deleted, it is referenced in investmentapplication");
 
            }
 
            db.Investments.Remove(res);
            await db.SaveChangesAsync();
            return true;
 
        }
    }
}