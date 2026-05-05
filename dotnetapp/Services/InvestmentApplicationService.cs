using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Services
{
    public class InvestmentApplicationService
    {
        private readonly ApplicationDbContext _context;

        public InvestmentApplicationService(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IEnumerable<InvestmentApplication>> GetAllInvestmentApplications()
        {
            return await _context.InvestmentApplications
                                 .Include(app => app.User)
                                 .Include(app => app.Investment)
                                 .ToListAsync();
        }

        [HttpGet("user/{userId}")]
        public async Task<IEnumerable<InvestmentApplication>> GetInvestmentApplicationsByUserId(int userId)
        {
            return await _context.InvestmentApplications
                                 .Where(app => app.UserId == userId)
                                 .Include(app => app.User)
                                 .Include(app => app.Investment)
                                 .ToListAsync();
        }

        [HttpPost]
        public async Task<bool> AddInvestmentApplication(InvestmentApplication investmentApplication)
        {
            bool alreadyExists = await _context.InvestmentApplications
                .AnyAsync(app => app.UserId == investmentApplication.UserId &&
                                 app.InvestmentId == investmentApplication.InvestmentId);

            if (alreadyExists)
            {
                throw new InvestmentException("User already applied for this investment");
            }

            _context.InvestmentApplications.Add(investmentApplication);
            await _context.SaveChangesAsync();
            return true;
        }
        [HttpPut("{id}")]
        public async Task<bool> UpdateInvestmentApplication(int investmentApplicationId, InvestmentApplication investmentApplication)
        {
            var existingApp = await _context.InvestmentApplications.FindAsync(investmentApplicationId);
            if (existingApp == null)
            {
                return false;
            }

            existingApp.InvestmentId = investmentApplication.InvestmentId;
            existingApp.UserId = investmentApplication.UserId;
            existingApp.ApplicationDate = investmentApplication.ApplicationDate;
            existingApp.ApplicationStatus = investmentApplication.ApplicationStatus;

            await _context.SaveChangesAsync();
            return true;
        }

        [HttpDelete("{id}")]

        public async Task<bool> DeleteInvestmentApplication(int investmentApplicationId)
        {
            var existingApp = await _context.InvestmentApplications.FindAsync(investmentApplicationId);
            if (existingApp == null)
            {
                return false;
            }

            _context.InvestmentApplications.Remove(existingApp);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
